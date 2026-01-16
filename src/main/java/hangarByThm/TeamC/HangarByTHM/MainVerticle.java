package hangarByThm.TeamC.HangarByTHM;

import io.vertx.core.Future;
import io.vertx.core.VerticleBase;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.JWTOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CorsHandler;
import io.vertx.ext.web.handler.JWTAuthHandler;
import io.vertx.pgclient.PgConnectOptions;
import io.vertx.sqlclient.SqlClient;
import io.vertx.sqlclient.PoolOptions;
import io.vertx.pgclient.PgBuilder;
import io.vertx.sqlclient.Tuple;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTAuthOptions;
import io.vertx.ext.auth.PubSecKeyOptions;



import java.util.List;
import java.util.UUID;

import static hangarByThm.TeamC.HangarByTHM.MainVerticle.DatabaseClient.client;



public class MainVerticle extends VerticleBase {
  private JWTAuth jwtAuth;

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

    jwtAuth = JWTAuth.create(vertx, new JWTAuthOptions()
      .addPubSecKey(new PubSecKeyOptions()
        .setAlgorithm("HS256")
        .setBuffer("super-secret-key-change-me"))
    );
    JWTAuthHandler jwtAuthHandler = JWTAuthHandler.create(jwtAuth);



    Router router = Router.router(vertx);


    SqlClient pool =  DatabaseClient.getClient(vertx); // Pool für SQL-Abfragen



    // CORS_konfigurationen: unabhängig von dem Server wo die GET-Anfragen gestartet wurden
    router.route().handler(CorsHandler.create()
      .addOrigin("*")
      .allowedMethod(HttpMethod.GET)
      .allowedMethod(HttpMethod.DELETE)
      .allowedMethod(HttpMethod.PUT)
      .allowedMethod(HttpMethod.POST)
      .allowedMethod(HttpMethod.OPTIONS)
      .allowedHeader("Content-Type")
      .allowedHeader("Authorization"));

    // Konfiguration für Anfrage mit Body
    router.route().handler(BodyHandler.create());


    // Alle Routen (GET, POST, GET,...) definieren
    /*router.get("/")
      .handler(this::home);*/

    router.post("/api/auth/register").handler(this::registerHandler);
    router.post("/api/auth/login").handler(this::loginHandler);
    router.get("/api/users/me")
      .handler(jwtAuthHandler)   // 🔥 JWT Handling
      .handler(this::getHomePage);


    pool
      .query("SELECT 1")
      .execute()
      .onSuccess(res -> {
        System.out.println("✅ Connexion PostgreSQL OK !");
      })
      .onFailure(err -> {
        System.err.println("❌ Error connexion PostgreSQL");
      });
    return vertx.createHttpServer().requestHandler(router)
      .listen(8888).onSuccess(http -> {
      System.out.println("HTTP server started on port 8888");
    });
  }

  private void getHomePage(RoutingContext ctx) {
    JsonObject principal = ctx.user().principal();

    //  id und rôle
    String userId = principal.getString("sub");
    String rolle = principal.getString("rolle");
    String email = principal.getString("email");

    JsonObject userJson = new JsonObject()
      .put("id", userId)
      .put("email", email)
      .put("rolle", rolle);

    ctx.response()
      .putHeader("Content-Type", "application/json")
      .setStatusCode(200)
      .end(userJson.encode());
  }
  private void loginHandler(RoutingContext ctx) {

    JsonObject body = ctx.body().asJsonObject();

    String email = body.getString("email");
    String password = body.getString("password");

    if (email == null || password == null) {
      ctx.response().setStatusCode(400).end("Missing credentials");
      return;
    }

    String sql = """
    SELECT id, email, passwort_hash, rolle
    FROM benutzer
    WHERE email = $1
  """;

    client
      .preparedQuery(sql)
      .execute(Tuple.of(email))
      .onFailure(err -> ctx.fail(500, err))
      .onSuccess(rows -> {

        if (!rows.iterator().hasNext()) {
          ctx.response().setStatusCode(401).end("Invalid credentials");
          return;
        }

        var row = rows.iterator().next();

        String storedPassword = row.getString("passwort_hash");

        // ⚠️ À améliorer plus tard avec BCrypt
        if (!storedPassword.equals(password)) {
          ctx.response().setStatusCode(401).end("Invalid credentials");
          return;
        }

        System.out.println("LOGIN erfolgreich");
        UUID userId = row.getUUID("id");
        String rolle = row.getString("rolle");

        String token = jwtAuth.generateToken(
          new JsonObject()
            .put("sub", userId.toString())
            .put("email", email)
            .put("rolle", rolle),
          new JWTOptions()
            .setExpiresInMinutes(60)
        );

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .end(new JsonObject()
            .put("token", token)
            .put("user", new JsonObject()
              .put("id", userId)
              .put("email", email)
              .put("rolle", rolle))
            .encode());
      });
  }


  private void registerHandler(RoutingContext ctx) {
    JsonObject body = ctx.body().asJsonObject();
    String rolle = body.getString("rolle");
    if (rolle == null) {
      ctx.response()
        .setStatusCode(400)
        .end("Rolle fehlt (hangaranbieter | flugzeugbesitzer)");
      return;
    }
    insertBenutzer(body)
      .compose(benutzerId -> {

        /* ===================== FLUGZEUGBESITZER ===================== */
        if ("flugzeugbesitzer".equalsIgnoreCase(rolle)) {
          return insertFlugzeugbesitzer(benutzerId, body);
        }

        /* ===================== HANGARANBIETER ===================== */
        return insertHangaranbieter(benutzerId, body)
          .compose(hangarId -> {

            /* ================= SERVICES ================= */
            JsonObject services =
              body.getJsonObject("services", new JsonObject());

            Future<Void> servicesFuture =
              insertServices(hangarId, services);

            // -------- Flugzeugtypen --------
            JsonArray flugzeugtypen =
              body.getJsonArray("flugzeugtypen", new JsonArray());

            Future<Void> typFuture = insertSequentially(
              flugzeugtypen,
              obj -> {
                JsonObject o = (JsonObject) obj;
                return insertFlugzeugtyp(
                  hangarId,
                  o.getString("typ"),
                  o.getInteger("stellplaetze")
                );
              }
            );

            // -------- Flugzeuggrößen --------
            JsonArray flugzeuggroessen =
              body.getJsonArray("flugzeuggroessen", new JsonArray());

            Future<Void> groesseFuture = insertSequentially(
              flugzeuggroessen,
              obj -> {
                JsonObject o = (JsonObject) obj;
                return insertFlugzeuggroesse(
                  hangarId,
                  o.getString("groesse"),
                  o.getInteger("stellplaetze")
                );
              }
            );

            return servicesFuture
              .compose(v -> typFuture)
              .compose(v -> groesseFuture);
          });
      })
      .onSuccess(v ->
        ctx.response()
          .setStatusCode(201)
          .putHeader("Content-Type", "application/json")
          .end(new JsonObject()
            .put("message", "Registration erfolgreich")
            .encode())
      )
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response()
          .setStatusCode(500)
          .end(err.getMessage());
      });
  }



  // -------------------- SQL INSERTIONS --------------------

  private Future<UUID> insertBenutzer(JsonObject body) {
    JsonObject adresse = body.getJsonObject("adresse", new JsonObject());
    String sql = "INSERT INTO benutzer(name,email,passwort_hash,rolle,strasse,hausnummer,plz,ort) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id";
    return client.preparedQuery(sql)
      .execute(Tuple.of(
        body.getString("name"),
        body.getString("email"),
        body.getString("password"), // Achtung: Man kann hier den hashwert berechnen
        body.getString("rolle"),
        adresse.getString("strasse"),
        adresse.getString("hausnummer"),
        adresse.getString("plz"),
        adresse.getString("ort")
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
        benutzer_id, firmenname, ansprechpartner, telefon, hangar_merkmale
      ) VALUES ($1,$2,$3,$4,$5::jsonb) RETURNING id
    """;

    return client.preparedQuery(sql)
      .execute(Tuple.of(
        benutzerId,
        body.getString("name"),
        body.getString("ansPartner"),
        body.getString("tel"),
        body.getJsonObject("hangarMerkmale").encode()
      ))
      .map(rowSet -> rowSet.iterator().next().getUUID("id"));
  }

  private Future<Void> insertFlugzeugtyp(
    UUID hangarId,
    String typ,
    Integer stellplaetze
  ) {
    String sql = """
    INSERT INTO hangaranbieter_flugzeugtypen
    (hangaranbieter_id, flugzeugtyp, freie_stellplatz_anzahl)
    VALUES ($1, $2::flugzeugtyp_enum, $3)
  """;

    return client.preparedQuery(sql)
      .execute(Tuple.of(hangarId, typ, stellplaetze))
      .mapEmpty();
  }


  private Future<Void> insertFlugzeuggroesse(
    UUID hangarId,
    String groesse,
    Integer stellplaetze
  ) {
    String sql = """
    INSERT INTO hangaranbieter_flugzeuggroessen
    (hangaranbieter_id, flugzeuggroesse, freie_stellplatz_anzahl)
    VALUES ($1, $2::flugzeuggroesse_enum, $3)
  """;

    return client.preparedQuery(sql)
      .execute(Tuple.of(hangarId, groesse, stellplaetze))
      .mapEmpty();
  }

  private Future<Void> insertServices(UUID hangarId, JsonObject services) {

    return insertSequentially(services.fieldNames(), key -> {
      JsonObject s = services.getJsonObject(key);

      // Si le service n'est pas aktiviert, on ignore
      if (!s.getBoolean("enabled", false)) {
        return Future.succeededFuture();
      }
      Integer preis = Integer.parseInt(s.getString("price"));
      String einheit = s.getString("unit");

      // Nom du service tel qu'il est dans la DB (ENUM)
      String serviceName = key; // "einlagerung" -> "Einlagerung"

      // On récupère d'abord l'ID du service existant
      String sqlGetServiceId = "SELECT id FROM service WHERE bezeichnung = $1::servicename_enum";

      return client.preparedQuery(sqlGetServiceId)
        .execute(Tuple.of(serviceName))
        .compose(rows -> {
          if (!rows.iterator().hasNext()) {
            return Future.failedFuture(
              new RuntimeException("Service " + serviceName + " not found in database")
            );
          }
          Integer serviceId = rows.iterator().next().getInteger("id");

          // Insérer dans angebotene_services
          String sqlInsertAngebot = """
                    INSERT INTO angebotene_services (hangaranbieter_id, service_id, preis, einheit)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT DO NOTHING
                """;

          return client.preparedQuery(sqlInsertAngebot)
            .execute(Tuple.of(hangarId, serviceId, preis, einheit))
            .mapEmpty();
        });
    });
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
