package hangarByThm.TeamC.HangarByTHM;

import io.vertx.core.Future;
import io.vertx.core.VerticleBase;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CorsHandler;
import io.vertx.pgclient.PgConnectOptions;
import io.vertx.sqlclient.Pool;
import io.vertx.sqlclient.SqlClient;
import io.vertx.sqlclient.PoolOptions;
import io.vertx.pgclient.PgBuilder;
import io.vertx.sqlclient.Tuple;
import org.flywaydb.core.Flyway;

import java.util.List;
import java.util.UUID;

import static hangarByThm.TeamC.HangarByTHM.MainVerticle.DatabaseClient.client;


public class MainVerticle extends VerticleBase {

  // The following snippet is only necessary if you want to start the server directly using IntelliJ
  public static void main(String[] args) {
    Vertx.vertx().deployVerticle(new MainVerticle());
  }



  public static class DatabaseClient {

    protected static SqlClient client;

    public static SqlClient getClient(Vertx vertx) {

      if (client == null) {

        PgConnectOptions connectOptions = new PgConnectOptions()
          .setHost("localhost")
          .setPort(5432)
          .setDatabase("hangar_db")
          .setUser("root")
          .setPassword("root");

        PoolOptions poolOptions = new PoolOptions()
          .setMaxSize(10);

        // Create the client pool
        client = PgBuilder
          .client()
          .with(poolOptions)
          .connectingTo(connectOptions)
          .using(vertx)
          .build();
      }

      return client;
    }
  }



  @Override
  public Future<?> start() {

    Router router = Router.router(vertx);
    //FlywayConfig.migrate();  // Migrationen updaten (aus der DB)

    SqlClient pool =  DatabaseClient.getClient(vertx); // Pool für SQL-Abfragen



    // CORS_konfigurationen: unabhängig von dem Server wo die GET-Anfragen gestartet wurden
    router.route().handler(CorsHandler.create()
      .addOrigin("*")
      .allowedMethod(HttpMethod.GET)
      .allowedMethod(HttpMethod.DELETE)
      .allowedMethod(HttpMethod.PUT)
      .allowedMethod(HttpMethod.POST));

    // Konfiguration für Anfrage mit Body
    router.route().handler(BodyHandler.create());


    // Alle Routen (GET, POST, GET,...) definieren
    router.get("/")
      .handler(this::home);

    router.post("/api/auth/register").handler(this::registerHandler);


    pool
      .query("SELECT 1")
      .execute()
      .onSuccess(res -> {
        System.out.println("✅ Connexion PostgreSQL OK !");
      })
      .onFailure(err -> {
        System.err.println("❌ Error connexion PostgreSQL");
      });

    //System.out.println(System.getenv("DB_PASSWORD"));





    return vertx.createHttpServer().requestHandler(router)
      .listen(8888).onSuccess(http -> {
      System.out.println("HTTP server started on port 8888");
    });
  }

  private void home(RoutingContext ctx) {
    ctx.response().setStatusCode(200).
      putHeader("Content-Type", "text/html").
      end("Welcome to HangarByTHM");
  }

  private void registerHandler(RoutingContext ctx) {
    JsonObject body = ctx.body().asJsonObject(); // Vert.x 5

    String rolle = body.getString("rolle", "hangaranbieter");

    insertBenutzer(body)
      .compose(benutzerId -> {
        if ("flugzeugbesitzer".equals(rolle)) {
          return insertFlugzeugbesitzer(benutzerId, body).mapEmpty();
        } else {
          return insertHangaranbieter(benutzerId, body)
            .compose(hangarId -> {
              // Flugzeugtypen

              JsonObject fts =
                body.getJsonObject("flugzeugtypUndStellplaetze", new JsonObject());

              JsonArray aircraftTypes =
                fts.getJsonArray("aircraftTypes", new JsonArray());

              Future<Void> typesFuture = insertSequentially(
                aircraftTypes,
                t -> insertFlugzeugtyp(hangarId, t.toString())
              );


              Future<Void> sizesFuture = insertSequentially(
                body.getJsonArray("flugzeuggroessen", new JsonArray()),
                g -> insertFlugzeuggroesse(hangarId, g.toString())
              );

              return typesFuture.compose(v -> sizesFuture);
            });
        }
      })
      .onSuccess(v -> ctx.response()
        .setStatusCode(201)
        .putHeader("Content-Type", "application/json")
        .end(new JsonObject().put("message", "Registration successful").encode()))
      .onFailure(err -> ctx.response()
        .setStatusCode(500)
        .putHeader("Content-Type", "application/json")
        .end(new JsonObject().put("error", err.getMessage()).encode()));
  }


  // -------------------- SQL INSERTIONS --------------------

  private Future<UUID> insertBenutzer(JsonObject body) {
    String sql = "INSERT INTO benutzer(name,email,passwort_hash,rolle) VALUES ($1,$2,$3,$4) RETURNING id";
    return client.preparedQuery(sql)
      .execute(Tuple.of(
        body.getString("name"),
        body.getString("email"),
        body.getString("password"), // attention : tu peux hasher ici
        body.getString("rolle")
      ))
      .map(rowSet -> rowSet.iterator().next().getUUID("id"));
  }

  private Future<Void> insertFlugzeugbesitzer(UUID benutzerId, JsonObject body) {
    String sql = "INSERT INTO flugzeugbesitzer(benutzer_id,telefon) VALUES ($1,$2)";
    return client.preparedQuery(sql)
      .execute(Tuple.of(
        benutzerId,
        body.getString("tel")
      ))
      .mapEmpty();
  }

  private Future<UUID> insertHangaranbieter(UUID benutzerId, JsonObject body) {
    String sql = """
      INSERT INTO hangaranbieter(
        benutzer_id, firmenname, ansprechpartner, telefon, hangar_merkmale, services, flugzeugtyp_und_stellplaetze
      ) VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7::jsonb) RETURNING id
    """;

    return client.preparedQuery(sql)
      .execute(Tuple.of(
        benutzerId,
        body.getString("firmenname"),
        body.getString("ansPartner"),
        body.getString("tel"),
        body.getJsonObject("hangarMerkmale").encode(),
        body.getJsonObject("services").encode(),
        body.getJsonObject("flugzeugtypUndStellplaetze").encode()
      ))
      .map(rowSet -> rowSet.iterator().next().getUUID("id"));
  }

  private Future<Void> insertFlugzeugtyp(UUID hangarId, String typ) {
    String sql = "INSERT INTO hangaranbieter_flugzeugtypen(hangaranbieter_id, flugzeugtyp) VALUES ($1,$2::flugzeugtyp_enum)";
    return client.preparedQuery(sql)
      .execute(Tuple.of(hangarId, typ))
      .mapEmpty();
  }

  private Future<Void> insertFlugzeuggroesse(UUID hangarId, String groesse) {
    String sql = "INSERT INTO hangaranbieter_flugzeuggroessen(hangaranbieter_id, flugzeuggroesse) VALUES ($1,$2::flugzeuggroesse_enum)";
    return client.preparedQuery(sql)
      .execute(Tuple.of(hangarId, groesse))
      .mapEmpty();
  }

  private <T> Future<Void> insertSequentially(
    Iterable<T> items,
    java.util.function.Function<T, Future<Void>> inserter
  ) {
    Future<Void> future = Future.succeededFuture();

    for (T item : items) {
      final T current = item; // <-- FINAL
      future = future.compose(v -> inserter.apply(current));
    }

    return future;
  }






}
