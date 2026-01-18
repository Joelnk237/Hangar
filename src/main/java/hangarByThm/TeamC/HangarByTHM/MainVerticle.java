package hangarByThm.TeamC.HangarByTHM;

import io.vertx.core.Future;
import io.vertx.core.VerticleBase;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.JWTOptions;
import io.vertx.ext.web.FileUpload;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CorsHandler;
import io.vertx.ext.web.handler.JWTAuthHandler;
import io.vertx.ext.web.handler.StaticHandler;
import io.vertx.pgclient.PgConnectOptions;
import io.vertx.sqlclient.SqlClient;
import io.vertx.sqlclient.PoolOptions;
import io.vertx.pgclient.PgBuilder;
import io.vertx.sqlclient.Tuple;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTAuthOptions;
import io.vertx.ext.auth.PubSecKeyOptions;


import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static hangarByThm.TeamC.HangarByTHM.MainVerticle.DatabaseClient.client;



public class MainVerticle extends VerticleBase {
  private JWTAuth jwtAuth;
  private FlugzeugbesitzerService flugzeugbesitzerService;
  private HangaranbieterService hangaranbieterService;

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

    this.flugzeugbesitzerService = new FlugzeugbesitzerService(client);
    this.hangaranbieterService = new HangaranbieterService(client);



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
    router.route().handler(
      BodyHandler.create()
        .setUploadsDirectory("uploads")
        .setMergeFormAttributes(true)
        .setDeleteUploadedFilesOnEnd(false)
    );


    router.route("/uploads/*").handler(StaticHandler.create("uploads"));

    // Alle Routen (GET, POST, GET,...) definieren

    router.post("/api/auth/register").handler(this::registerHandler);
    router.post("/api/auth/login").handler(this::loginHandler);

    router.get("/api/users/me")
      .handler(jwtAuthHandler)   // 🔥 JWT Handling
      .handler(this::getHomePage);

    /*router.post("/api/fleuzeuge")
      .handler(jwtAuthHandler)   // 🔥 JWT Handling
      .handler(this::createFlugzeug);*/

    router.post("/api/flugzeuge")
      .handler(jwtAuthHandler)  // JWT Handling
      .handler(this::createFlugzeugHandler);


    router.put("/api/flugzeuge/:id")
      .handler(jwtAuthHandler)  // JWT Handling
      .handler(this::flugzeugbesitzerContextHandler)
      .handler(this::modifyFlugzeugHandler);

    router.delete("/api/flugzeuge/:id")
      .handler(jwtAuthHandler)
      .handler(this::deleteFlugzeugHandler);

    router.get("/api/flugzeuge/:id")
      .handler(this::getFlugzeugInfosHandler);

    router.get("/api/flugzeuge")
      .handler(jwtAuthHandler)
      .handler(this::flugzeugbesitzerContextHandler)
      .handler(this::getMyFlugzeugeHandler);

    router.get("/api/hangaranbieter/spezialisierungen")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::getHangarSpezialisierungenHandler);

    router.get("/api/hangaranbieter/services")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::getAngeboteneServicesHandler);

    router.get("/api/hangaranbieter/zusatzservices")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::getZusatzservicesHandler);

    router.get("/api/stellplaetze/:id")
      .handler(this::getStellplatzInfosHandler);

    router.post("/api/stellplaetze")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::createStellplatzHandler);

    router.get("/api/stellplaetze")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::getMyStellplaetzeHandler);








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

  private void createFlugzeugHandler(RoutingContext ctx) {

    UUID userId = UUID.fromString(ctx.user().principal().getString("sub"));

    JsonObject json = new JsonObject();
    ctx.request().formAttributes().forEach(e ->
      json.put(e.getKey(), e.getValue())
    );

    Flugzeug flugzeug = Flugzeug.fromJson(json);

    // flugzeugbesitzerId in der Flugzeugbesitzer Tabelle
    String selectOwner = "SELECT id FROM flugzeugbesitzer WHERE benutzer_id = $1";

    client.preparedQuery(selectOwner)
      .execute(Tuple.of(userId))
      .onFailure(err -> ctx.fail(500, err))
      .onSuccess(rows -> {
        if (!rows.iterator().hasNext()) {
          ctx.response().setStatusCode(404).end("Flugzeugbesitzer nicht gefunden");
          return;
        }

        UUID flugzeugbesitzerId = rows.iterator().next().getUUID("id");
        flugzeug.setFlugzeugbesitzerId(flugzeugbesitzerId);



        // Image
        if (!ctx.fileUploads().isEmpty()) {
          FileUpload upload = ctx.fileUploads().iterator().next();
          String filename = UUID.randomUUID() + "-" + upload.fileName();
          String target = "uploads/flugzeuge/" + filename;

          try {
            Files.move(Path.of(upload.uploadedFileName()), Path.of(target));
            flugzeug.setBild("/uploads/flugzeuge/" + filename);
          } catch (IOException e) {
            ctx.fail(e);
            return;
          }
        }

        String sql = """
    INSERT INTO flugzeug
    (flugzeugbesitzer_id, kennzeichen, flugzeugtyp, flugzeuggroesse,
     bild, flugstunden, flugkilometer, treibstoffverbrauch, frachtkapazitaet)
    VALUES ($1,$2,$3::flugzeugtyp_enum,$4::flugzeuggroesse_enum,$5,$6,$7,$8,$9)
  """;


        client.preparedQuery(sql)
          .execute(Tuple.of(
            flugzeug.getFlugzeugbesitzerId(),
            flugzeug.getKennzeichen(),
            flugzeug.getFlugzeugtyp().name(),
            flugzeug.getFlugzeuggroesse().name(),
            flugzeug.getBild(),
            flugzeug.getFlugstunden(),
            flugzeug.getFlugkilometer(),
            flugzeug.getTreibstoffverbrauch(),
            flugzeug.getFrachtkapazitaet()
          ))
          .onSuccess(v ->
            ctx.response()
              .setStatusCode(201)
              .putHeader("Content-Type", "application/json")
              .end(new JsonObject()
                .put("message", "Flugzeug erfolgreich erstellt")
                .encode())
          )
          .onFailure(err -> ctx.fail(500, err));

      });
  }




  private void modifyFlugzeugHandler(RoutingContext ctx) {

    UUID flugzeugbesitzerId = ctx.get("flugzeugbesitzerId");
    UUID flugzeugId = UUID.fromString(ctx.pathParam("id"));

    JsonObject json = new JsonObject();
    ctx.request().formAttributes().forEach(e ->
      json.put(e.getKey(), e.getValue())
    );

    Flugzeug flugzeug = Flugzeug.fromJson(json);
    flugzeug.setId(flugzeugId);
    flugzeug.setFlugzeugbesitzerId(flugzeugbesitzerId);

    // -------- Image Upload (optional) --------
    if (!ctx.fileUploads().isEmpty()) {
      FileUpload upload = ctx.fileUploads().iterator().next();
      String filename = UUID.randomUUID() + "-" + upload.fileName();
      String target = "uploads/flugzeuge/" + filename;

      try {
        Files.move(
          Path.of(upload.uploadedFileName()),
          Path.of(target),
          StandardCopyOption.REPLACE_EXISTING
        );
        flugzeug.setBild("/uploads/flugzeuge/" + filename);
      } catch (IOException e) {
        ctx.fail(500, e);
        return;
      }
    }

    String sql = """
    UPDATE flugzeug SET
      kennzeichen = $1,
      flugzeugtyp = $2::flugzeugtyp_enum,
      flugzeuggroesse = $3::flugzeuggroesse_enum,
      bild = COALESCE($4, bild),
      flugstunden = $5,
      flugkilometer = $6,
      treibstoffverbrauch = $7,
      frachtkapazitaet = $8
    WHERE id = $9
      AND flugzeugbesitzer_id = $10
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(
        flugzeug.getKennzeichen(),
        flugzeug.getFlugzeugtyp().name(),
        flugzeug.getFlugzeuggroesse().name(),
        flugzeug.getBild(),
        flugzeug.getFlugstunden(),
        flugzeug.getFlugkilometer(),
        flugzeug.getTreibstoffverbrauch(),
        flugzeug.getFrachtkapazitaet(),
        flugzeugId,
        flugzeug.getFlugzeugbesitzerId()
      ))
      .onSuccess(res -> {
        if (res.rowCount() == 0) {
          ctx.response().setStatusCode(404).end("Flugzeug nicht gefunden");
        } else {
          ctx.response()
            .setStatusCode(200)
            .end(new JsonObject()
              .put("message", "Flugzeug erfolgreich aktualisiert")
              .encode());
        }
      })
      .onFailure(err -> ctx.fail(500, err));
  }


  private void flugzeugbesitzerContextHandler(RoutingContext ctx) {

    UUID benutzerId = UUID.fromString(
      ctx.user().principal().getString("sub")
    );

    flugzeugbesitzerService
      .getFlugzeugbesitzerId(benutzerId)
      .onSuccess(id -> {
        ctx.put("flugzeugbesitzerId", id);
        ctx.next();
      })
      .onFailure(err ->
        ctx.response().setStatusCode(403).end(err.getMessage())
      );
  }

  private void hangaranbieterContextHandler(RoutingContext ctx) {

    UUID benutzerId = UUID.fromString(
      ctx.user().principal().getString("sub")
    );

    hangaranbieterService
      .getHAnbieterId(benutzerId)
      .onSuccess(id -> {
        ctx.put("anbieterId", id);
        ctx.next();
      })
      .onFailure(err ->
        ctx.response().setStatusCode(403).end(err.getMessage())
      );
  }

  private void deleteFlugzeugHandler(RoutingContext ctx) {

    UUID benutzerId = UUID.fromString(
      ctx.user().principal().getString("sub")
    );

    UUID flugzeugId;
    try {
      flugzeugId = UUID.fromString(ctx.pathParam("id"));
    } catch (IllegalArgumentException e) {
      ctx.response().setStatusCode(400).end("Ungültige Flugzeug-ID");
      return;
    }

    // 1. flugzeugbesitzer_id abrufen
    flugzeugbesitzerService
      .getFlugzeugbesitzerId(benutzerId)

      // 2.   Bild-Pfad abrufen(optional)
      .compose(flugzeugbesitzerId -> {

        String selectSql = """
        SELECT bild
        FROM flugzeug
        WHERE id = $1
          AND flugzeugbesitzer_id = $2
      """;

        return client
          .preparedQuery(selectSql)
          .execute(Tuple.of(flugzeugId, flugzeugbesitzerId))
          .compose(rows -> {

            if (!rows.iterator().hasNext()) {
              return Future.failedFuture("NOT_FOUND");
            }

            String bildPfad = rows.iterator().next().getString("bild");

            // 3. Flugzeug in DB löschen
            String deleteSql = """
            DELETE FROM flugzeug
            WHERE id = $1
              AND flugzeugbesitzer_id = $2
          """;

            return client
              .preparedQuery(deleteSql)
              .execute(Tuple.of(flugzeugId, flugzeugbesitzerId))
              .onSuccess(v -> deleteBildIfExists(bildPfad));
          });
      })

      // 4 succes
      .onSuccess(v ->
        ctx.response()
          .setStatusCode(200)
          .putHeader("Content-Type", "application/json")
          .end(new JsonObject()
            .put("message", "Flugzeug erfolgreich gelöscht")
            .encode())
      )

      // 5. Error handling
      .onFailure(err -> {
        if ("NOT_FOUND".equals(err.getMessage())) {
          ctx.response().setStatusCode(404).end("Flugzeug nicht gefunden");
        } else {
          err.printStackTrace();
          ctx.response().setStatusCode(500).end("Serverfehler");
        }
      });
  }

  private void deleteBildIfExists(String bildPfad) {
    if (bildPfad == null || bildPfad.isBlank()) return;

    try {
      Path path = Path.of("." + bildPfad); // "/uploads/..." → "./uploads/..."
      Files.deleteIfExists(path);
    } catch (IOException e) {
      System.err.println(" Bild konnte nicht gelöscht werden: " + e.getMessage());
    }
  }


  private void getMyFlugzeugeHandler(RoutingContext ctx) {

    UUID flugzeugbesitzerId = ctx.get("flugzeugbesitzerId");

    String sql = """
    SELECT
      id,
      flugzeugbesitzer_id,
      flugzeugtyp,
      flugzeuggroesse,
      kennzeichen,
      bild,
      flugstunden,
      flugkilometer,
      treibstoffverbrauch,
      frachtkapazitaet, belegt
    FROM flugzeug
    WHERE flugzeugbesitzer_id = $1
    ORDER BY kennzeichen
  """;

    client
      .preparedQuery(sql)
      .execute(Tuple.of(flugzeugbesitzerId))
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response()
          .setStatusCode(500)
          .end("Fehler beim Laden der Flugzeuge");
      })
      .onSuccess(rows -> {

        JsonArray result = new JsonArray();

        rows.forEach(row -> {
          Flugzeug f = new Flugzeug();
          f.setStatus(row.getBoolean("belegt"));

          f.setId(row.getUUID("id"));
          f.setFlugzeugbesitzerId(row.getUUID("flugzeugbesitzer_id"));
          f.setKennzeichen(row.getString("kennzeichen"));
          f.setBild(row.getString("bild"));

          if (row.getString("flugzeugtyp") != null) {
            f.setFlugzeugtyp(
              Flugzeugtyp.valueOf(row.getString("flugzeugtyp"))
            );
          }

          if (row.getString("flugzeuggroesse") != null) {
            f.setFlugzeuggroesse(
              Flugzeuggroesse.valueOf(row.getString("flugzeuggroesse"))
            );
          }

          f.setFlugstunden(row.getInteger("flugstunden"));
          f.setFlugkilometer(row.getInteger("flugkilometer"));
          f.setTreibstoffverbrauch(
            row.getBigDecimal("treibstoffverbrauch") != null
              ? row.getBigDecimal("treibstoffverbrauch").doubleValue()
              : null
          );
          f.setFrachtkapazitaet(row.getInteger("frachtkapazitaet"));

          result.add(f.toJson());
        });

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .setStatusCode(200)
          .end(result.encode());
      });
  }

  private void getHangarSpezialisierungenHandler(RoutingContext ctx) {

    UUID hangaranbieterId = ctx.get("anbieterId");

    String sqlTypen = """
    SELECT flugzeugtyp
    FROM hangaranbieter_flugzeugtypen
    WHERE hangaranbieter_id = $1
  """;

    String sqlGroessen = """
    SELECT flugzeuggroesse
    FROM hangaranbieter_flugzeuggroessen
    WHERE hangaranbieter_id = $1
  """;

    JsonObject result = new JsonObject();

    client
      .preparedQuery(sqlTypen)
      .execute(Tuple.of(hangaranbieterId))
      .compose(typenRows -> {

        JsonArray typen = new JsonArray();
        typenRows.forEach(r ->
          typen.add(r.getString("flugzeugtyp"))
        );

        result.put("flugzeugtypen", typen);

        return client
          .preparedQuery(sqlGroessen)
          .execute(Tuple.of(hangaranbieterId));
      })
      .onSuccess(groessenRows -> {

        JsonArray groessen = new JsonArray();
        groessenRows.forEach(r ->
          groessen.add(r.getString("flugzeuggroesse"))
        );

        result.put("flugzeuggroessen", groessen);

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .end(result.encode());
      })
      .onFailure(err -> ctx.fail(500, err));
  }

  private void getAngeboteneServicesHandler(RoutingContext ctx) {

    UUID hangaranbieterId = ctx.get("anbieterId");

    String sql = """
    SELECT s.id AS service_id,
           s.bezeichnung,
           a.preis,
           a.einheit
    FROM angebotene_services a
    JOIN service s ON s.id = a.service_id
    WHERE a.hangaranbieter_id = $1
  """;

    client
      .preparedQuery(sql)
      .execute(Tuple.of(hangaranbieterId))
      .onSuccess(rows -> {

        JsonArray services = new JsonArray();

        rows.forEach(row ->
          services.add(
            AngeboteneService.fromRow(row).toJson()
          )
        );

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .end(services.encode());
      })
      .onFailure(err -> ctx.fail(500, err));
  }

  private void getZusatzservicesHandler(RoutingContext ctx) {

    UUID hangaranbieterId = ctx.get("anbieterId");

    String sql = """
    SELECT *
    FROM zusatzservice
    WHERE hangaranbieter_id = $1
  """;

    client
      .preparedQuery(sql)
      .execute(Tuple.of(hangaranbieterId))
      .onSuccess(rows -> {

        JsonArray result = new JsonArray();

        rows.forEach(row ->
          result.add(Zusatzservice.fromRow(row).toJson())
        );

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .end(result.encode());
      })
      .onFailure(err -> ctx.fail(500, err));
  }

  private void getStellplatzInfosHandler(RoutingContext ctx) {

    UUID stellplatzId;
    try {
      stellplatzId = UUID.fromString(ctx.pathParam("id"));
    } catch (IllegalArgumentException e) {
      ctx.response()
        .setStatusCode(400)
        .end("Ungültige Stellplatz-ID");
      return;
    }

    String sql = """
    SELECT
      id,
      hangaranbieter_id,
      kennzeichen,
      flugzeugtyp,
      flugzeuggroesse,
      standort,
      besonderheit,
      availability
    FROM stellplatz
    WHERE id = $1
  """;

    client
      .preparedQuery(sql)
      .execute(Tuple.of(stellplatzId))
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response()
          .setStatusCode(500)
          .end("Fehler beim Laden des Stellplatzes");
      })
      .onSuccess(rows -> {

        if (!rows.iterator().hasNext()) {
          ctx.response()
            .setStatusCode(404)
            .end("Stellplatz nicht gefunden");
          return;
        }

        Stellplatz stellplatz =
          Stellplatz.fromRow(rows.iterator().next());

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .setStatusCode(200)
          .end(stellplatz.toJson().encode());
      });
  }

  private void createStellplatzHandler(RoutingContext ctx) {

    UUID hangaranbieterId = ctx.get("anbieterId");

    // ---------- FORM DATA ----------
    JsonObject json = new JsonObject();
    ctx.request().formAttributes().forEach(e ->
      json.put(e.getKey(), e.getValue())
    );

    Stellplatz stellplatz = Stellplatz.fromJson(json);
    stellplatz.setHangaranbieterId(hangaranbieterId);

    // ---------- IMAGE UPLOAD ----------
    if (!ctx.fileUploads().isEmpty()) {
      FileUpload upload = ctx.fileUploads().iterator().next();
      String filename = UUID.randomUUID() + "-" + upload.fileName();
      String target = "uploads/stellplaetze/" + filename;

      try {
        Files.createDirectories(Path.of("uploads/stellplaetze"));
        Files.move(Path.of(upload.uploadedFileName()), Path.of(target));
        stellplatz.setBild("/uploads/stellplaetze/" + filename);
      } catch (IOException e) {
        ctx.fail(500, e);
        return;
      }
    }

    // ---------- INSERT STELLPLATZ ----------
    String sql = """
    INSERT INTO stellplatz
    (hangaranbieter_id, kennzeichen, besonderheit, bild,
     flugzeugtyp, flugzeuggroesse, standort, availability)
    VALUES ($1,$2,$3,$4,$5::flugzeugtyp_enum,$6::flugzeuggroesse_enum,$7,$8)
    RETURNING id
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(
        stellplatz.getHangaranbieterId(),
        stellplatz.getKennzeichen(),
        stellplatz.getBesonderheit(),
        stellplatz.getBild(),
        stellplatz.getFlugzeugtyp() != null ? stellplatz.getFlugzeugtyp().name() : null,
        stellplatz.getFlugzeuggroesse() != null ? stellplatz.getFlugzeuggroesse().name() : null,
        stellplatz.getStandort(),
        true
      ))
      .compose(rows -> {

        UUID stellplatzId = rows.iterator().next().getUUID("id");

        // ---------- SERVICES ----------
        List<String> services =
          ctx.request().formAttributes().getAll("services");

        if (services == null || services.isEmpty()) {
          return Future.succeededFuture();
        }

        return insertServicesForStellplatz(stellplatzId, services);
      })
      .onSuccess(v ->
        ctx.response()
          .setStatusCode(201)
          .putHeader("Content-Type", "application/json")
          .end(new JsonObject()
            .put("message", "Stellplatz erfolgreich erstellt")
            .encode())
      )
      .onFailure(err -> {
        err.printStackTrace();
        ctx.fail(500, err);
      });
  }

  private Future<Void> insertServicesForStellplatz(
    UUID stellplatzId,
    List<String> services
  ) {

    return insertSequentially(services, serviceName -> {

      String sqlGetServiceId =
        "SELECT id FROM service WHERE bezeichnung = $1::servicename_enum";

      return client.preparedQuery(sqlGetServiceId)
        .execute(Tuple.of(serviceName))
        .compose(rows -> {
          if (!rows.iterator().hasNext()) {
            return Future.failedFuture("Service nicht gefunden: " + serviceName);
          }

          Integer serviceId = rows.iterator().next().getInteger("id");

          String insertSql = """
          INSERT INTO service_zu_stellplatz (stellplatz_id, service_id)
          VALUES ($1,$2)
        """;

          return client.preparedQuery(insertSql)
            .execute(Tuple.of(stellplatzId, serviceId))
            .mapEmpty();
        });
    });
  }


  private void getMyStellplaetzeHandler(RoutingContext ctx) {

    UUID hangaranbieterId = ctx.get("anbieterId");

    String sqlStellplaetze = """
    SELECT
      id,
      kennzeichen,
      besonderheit,
      standort,
      availability,
      bild,
      flugzeugtyp,
      flugzeuggroesse
    FROM stellplatz
    WHERE hangaranbieter_id = $1
    ORDER BY kennzeichen
  """;

    String sqlServices = """
    SELECT
      szs.stellplatz_id,
      s.bezeichnung,
      a.preis,
      a.einheit
    FROM service_zu_stellplatz szs
    JOIN service s ON s.id = szs.service_id
    JOIN angebotene_services a
      ON a.service_id = s.id
    WHERE a.hangaranbieter_id = $1
  """;

    JsonArray response = new JsonArray();
    Map<UUID, JsonObject> stellplatzMap = new HashMap<>();

    // Stellplätze laden
    client.preparedQuery(sqlStellplaetze)
      .execute(Tuple.of(hangaranbieterId))
      .compose(rows -> {

        rows.forEach(row -> {
          UUID id = row.getUUID("id");

          JsonObject stellplatzJson = new JsonObject()
            .put("id", id.toString())
            .put("kennzeichen", row.getString("kennzeichen"))
            .put("besonderheit", row.getString("besonderheit"))
            .put("standort", row.getString("standort"))
            .put("availability", row.getBoolean("availability"))
            .put("bild", row.getString("bild"))
            .put("flugzeugtyp", row.getString("flugzeugtyp"))
            .put("flugzeuggroesse", row.getString("flugzeuggroesse"))
            .put("services", new JsonArray());

          stellplatzMap.put(id, stellplatzJson);
          response.add(stellplatzJson);
        });

        // Services laden
        return client
          .preparedQuery(sqlServices)
          .execute(Tuple.of(hangaranbieterId));
      })
      .onSuccess(serviceRows -> {

        serviceRows.forEach(row -> {
          UUID stellplatzId = row.getUUID("stellplatz_id");

          JsonObject serviceJson = new JsonObject()
            .put("bezeichnung", row.getString("bezeichnung"))
            .put("preis", row.getBigDecimal("preis") != null
              ? row.getBigDecimal("preis").doubleValue()
              : null)
            .put("einheit", row.getString("einheit"));

          JsonObject stellplatz =
            stellplatzMap.get(stellplatzId);

          if (stellplatz != null) {
            stellplatz
              .getJsonArray("services")
              .add(serviceJson);
          }
        });

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .setStatusCode(200)
          .end(response.encode());
      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.fail(500, err);
      });
  }


















}
