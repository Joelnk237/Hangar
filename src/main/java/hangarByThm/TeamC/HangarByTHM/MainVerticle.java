package hangarByThm.TeamC.HangarByTHM;

import io.vertx.core.Future;
import io.vertx.core.MultiMap;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

import io.vertx.core.VerticleBase;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.http.HttpServerRequest;
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
import io.vertx.sqlclient.Row;
import io.vertx.sqlclient.SqlClient;
import io.vertx.sqlclient.PoolOptions;
import io.vertx.pgclient.PgBuilder;
import io.vertx.sqlclient.Tuple;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTAuthOptions;
import io.vertx.ext.auth.PubSecKeyOptions;


import java.io.IOException;
import java.nio.file.*;
import java.util.*;

import static hangarByThm.TeamC.HangarByTHM.MainVerticle.DatabaseClient.client;



public class MainVerticle extends VerticleBase {
  private JWTAuth jwtAuth;
  private FlugzeugbesitzerService flugzeugbesitzerService;
  private HangaranbieterService hangaranbieterService;
  private ZusatzserviceRepository zusatzserviceRepository;

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
    this.zusatzserviceRepository= new ZusatzserviceRepository(client);



    // CORS_konfigurationen: unabhängig von dem Server wo die GET-Anfragen gestartet wurden
    router.route().handler(CorsHandler.create()
      .addOrigin("*")
      .allowedMethod(HttpMethod.GET)
      .allowedMethod(HttpMethod.DELETE)
      .allowedMethod(HttpMethod.PUT)
      .allowedMethod(HttpMethod.POST)
      .allowedMethod(HttpMethod.PATCH)
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
      .handler(jwtAuthHandler)   // JWT Handling
      .handler(this::getHomePage);

    router.get("/api/hangaranbieter/dashboard")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::getHangaranbieterDashboard);

    router.get("/api/flugzeugbesitzer/me")
      .handler(jwtAuthHandler)
      .handler(this::flugzeugbesitzerContextHandler)
      .handler(this::getFBesitzerInfosHandler);


    router.post("/api/flugzeuge")
      .handler(jwtAuthHandler)  // JWT Handling
      .handler(this::createFlugzeugHandler);


    router.put("/api/flugzeuge/:id")
      .handler(jwtAuthHandler)
      .handler(this::flugzeugbesitzerContextHandler)
      .handler(this::updateFlugzeugHandler);


    router.delete("/api/flugzeuge/:id")
      .handler(jwtAuthHandler)
      .handler(this::flugzeugbesitzerContextHandler)
      .handler(this::deleteFlugzeugHandler);


    router.get("/api/flugzeuge/:id")
      .handler(jwtAuthHandler)
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

    router.post("/api/hangaranbieter/services")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::createAngeboteneServicesHandler);

    router.put("/api/hangaranbieter/services")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::updateAngeboteneServicesHandler);

    router.delete("/api/hangaranbieter/services/:id")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::deleteAngeboteneServiceHandler);
    //controller Hangaranbieter
    router.get("/api/hangaranbieter/zusatzservices")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::getZusatzservicesHandler);

    //Flugzeugbesitzer zugriff
    router.get("/api/hangaranbieter/:id/zusatzservices")
      .handler(this::getZusatzservicesHandler);

    router.post("/api/hangaranbieter/zusatzservices")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::createZusatzserviceHandler);

    router.put("/api/hangaranbieter/zusatzservices")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::updateZusatzserviceHandler);
    router.delete("/api/hangaranbieter/zusatzservices/:id")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::deleteZusatzserviceHandler);

    router.post("/api/zusatzservices/buchen")
      .handler(jwtAuthHandler)
      .handler(this::buchZusatzserviceHandler);


    router.get("/api/hangaranbieter/reservierungen")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::getReservierungenHandler);



    router.get("/api/stellplaetze/:id")
      .handler(this::getStellplatzInfosHandler);

    //Stellplatz löschen
    router.delete("/api/stellplaetze/:id")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::deleteStellplatzHandler);


    //Stellplatzcontroller: stellplatz erfassen
    router.post("/api/stellplaetze")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::createStellplatzHandler);

    // Hangarcontroller: Stellplätze lade
    router.get("/api/stellplaetze")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::getMyStellplaetzeHandler);

    // stellplatz suchen
    router.get("/api/search/stellplaetze/options")
      .handler(this::searchStellplaetzeHandler);

    // Stellplatzcontroler: alle Infos über stellplatz
    router.get("/api/stellplaetze/:id/details")
      .handler(this::getStellplatzByIdHandler);

    //Stellplatzcontroller: avaibility aktualisieren
    router.put("/api/stellplaetze/:id/availability")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::updateStellplatzAvailabilityHandler);

    //Stellplatz aktualisieren
    router.put("/api/stellplaetze/:id")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::updateStellplatzHandler);



    router.get("/api/stellplaetze/:id/toupdate")
      .handler(this::getStellplatzHandler);



    //Stellplatz reservieren
    router.post("/api/reservierungen")
      .handler(jwtAuthHandler)
      .handler(this::flugzeugbesitzerContextHandler)
      .handler(this::makeReservierung);

    // Belegte Flugzeuge
    router.get("/api/hangaranbieter/stellplaetze/manage")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::getBelegteStellplaetzeHandler);

    //fahrbereitschaft einstellen
    router.put("/api/zustand/fahrbereitschaft")
      .handler(jwtAuthHandler)
      .handler(this::updateFahrbereitschaftHandler);

    router.get("/api/flugzeuge/:id/details")
      .handler(jwtAuthHandler)
      .handler(this::flugzeugbesitzerContextHandler)
      .handler(this::getFlugzeugDetailsHandler);
    //reservierung stornieren
    router.delete("/api/hangaranbieter/reservierungen")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::deleteReservierungHandler);

    //Angebot anfordern
    router.post("/api/angebote")
      .handler(jwtAuthHandler)
      .handler(this::flugzeugbesitzerContextHandler)
      .handler(this::createAngebotAnfrageHandler);

   // erhaltene Angebote
    router.get("/api/angebote/me")
      .handler(jwtAuthHandler)
      .handler(this::flugzeugbesitzerContextHandler)
      .handler(this::getMyAnsweredAngeboteHandler);

    //Angebot annehmen
    router.put("/api/angebote/:id/accept")
      .handler(jwtAuthHandler)
      .handler(this::flugzeugbesitzerContextHandler)
      .handler(this::acceptAngebotHandler);

    //Angebot ablehnen
    router.put("/api/angebote/:id/deny")
      .handler(jwtAuthHandler)
      .handler(this::flugzeugbesitzerContextHandler)
      .handler(this::denyAngebotHandler);

    // Angebot erfassen
    router.put("/api/angebote/:id/propose")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::proposeAngebotHandler);

    //erhaltene Angebotsanfragen
    router.get("/api/angebote/received")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::getReceivedAngeboteHandler);

    //Angebot stornieren
    router.delete("/api/angebote/:id")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::deleteAngebotHandler);

    //Übergabe/Rückgabetermin erfassen
    router.post("/api/termine")
      .handler(jwtAuthHandler)
      .handler(this::flugzeugbesitzerContextHandler)
      .handler(this::createTerminHandler);

    //GET meine Termine
    router.get("/api/termine/me")
      .handler(jwtAuthHandler)
      .handler(this::terminMeHandler);

    //Detailsinfos anfordern
    router.post("/api/anfragen/detailsinfos")
      .handler(jwtAuthHandler)
      .handler(this::flugzeugbesitzerContextHandler)
      .handler(this::createDetailsinfosAnfrageHandler);

    //Anfrage an HA
    router.post("/api/anfragen")
      .handler(jwtAuthHandler)
      .handler(this::flugzeugbesitzerContextHandler)
      .handler(this::createAnfrageHandler);

    //GET Anfragen (Hangaranbieter)
    router.get("/api/anfragen")
      .handler(jwtAuthHandler)
      .handler(this::hangaranbieterContextHandler)
      .handler(this::getAnfragenForHangaranbieter);

    //Anfrage löschen
    router.delete("/api/anfragen/:id")
      .handler(jwtAuthHandler)
      .handler(this::deleteAnfrageHandler);

    //Detailsinfos senden
    router.post("/api/anfragen/:id/detailsinfos")
      .handler(jwtAuthHandler)
      .handler(this::sendDetailsinfosHandler);

    //Anfrage Status aktualisieren
    router.patch("/api/anfragen/:id/answered")
      .handler(jwtAuthHandler)
      .handler(this::markAnfrageAnsweredHandler);

    //Nachrichten abrufen
    router.get("/api/nachrichten/me")
      .handler(jwtAuthHandler)
      .handler(this::flugzeugbesitzerContextHandler)
      .handler(this::getNachrichtenForFlugzeugbesitzer);

    //Delete Nachricht
    router.delete("/api/nachrichten/:id")
      .handler(jwtAuthHandler)
      .handler(this::deleteNachrichtHandler);






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

        // prüft, ob die Passwörter ubereinstimmen
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

    String abmasseStr = json.getString("abmasse");
    JsonObject abmasseJson;
    if (abmasseStr != null && !abmasseStr.isBlank()) {
      abmasseJson = new JsonObject(abmasseStr);
    } else {
      abmasseJson = null;
    }

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
     bild, flugstunden, flugkilometer, treibstoffverbrauch, frachtkapazitaet, baujahr, abmasse)
    VALUES ($1,$2,$3::flugzeugtyp_enum,$4::flugzeuggroesse_enum,$5,$6,$7,$8,$9,$10,$11::jsonb)
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
            flugzeug.getFrachtkapazitaet(),
            flugzeug.getBaujahr(),
            abmasseJson != null ? abmasseJson.encode(): null
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


  private void updateFlugzeugHandler(RoutingContext ctx) {

    UUID flugzeugId;
    UUID flugzeugbesitzerId;

    try {
      flugzeugId = UUID.fromString(ctx.pathParam("id"));
      flugzeugbesitzerId = ctx.get("flugzeugbesitzerId");
    } catch (Exception e) {
      ctx.response().setStatusCode(400).end("Ungültige ID");
      return;
    }

      String kennzeichen = ctx.request().getFormAttribute("kennzeichen");
      String flugzeugtyp = ctx.request().getFormAttribute("flugzeugtyp");
      String flugzeuggroesse = ctx.request().getFormAttribute("flugzeuggroesse");
      String abmasseJson = ctx.request().getFormAttribute("abmasse");

      if (kennzeichen == null || flugzeugtyp == null || flugzeuggroesse == null || abmasseJson == null) {
        ctx.response().setStatusCode(400).end("Pflichtfelder fehlen");
        return;
      }

      JsonObject abmasse;
      try {
        abmasse = new JsonObject(abmasseJson);
      } catch (Exception e) {
        ctx.response().setStatusCode(400).end("Ungültiges Abmasse-Format");
        return;
      }

      // Image optionnelle
      FileUpload upload = ctx.fileUploads().stream().findFirst().orElse(null);

      if (upload != null) {
        handleUpdateWithImage(ctx, flugzeugId, flugzeugbesitzerId, ctx.request(), abmasse, upload);
      } else {
        handleUpdateWithoutImage(ctx, flugzeugId, flugzeugbesitzerId, ctx.request(), abmasse);
      }
  }

  private void handleUpdateWithoutImage(
    RoutingContext ctx,
    UUID flugzeugId,
    UUID besitzerId,
    HttpServerRequest req,
    JsonObject abmasse
  ) {

    String sql = """
    UPDATE flugzeug
    SET
      kennzeichen = $1,
      flugzeugtyp = $2,
      flugzeuggroesse = $3,
      abmasse = $4,
      flugstunden = $5,
      flugkilometer = $6,
      baujahr = $7,
      treibstoffverbrauch = $8,
      frachtkapazitaet = $9
    WHERE id = $10 AND flugzeugbesitzer_id = $11
  """;

    Tuple tuple = Tuple.tuple()
      .addString(req.getFormAttribute("kennzeichen"))
      .addString(req.getFormAttribute("flugzeugtyp"))
      .addString(req.getFormAttribute("flugzeuggroesse"))
      .addValue(abmasse.encode())
      .addInteger(Integer.parseInt(req.getFormAttribute("flugstunden")))
      .addInteger(Integer.parseInt(req.getFormAttribute("flugkilometer")))
      .addInteger(Integer.parseInt(req.getFormAttribute("baujahr")))
      .addBigDecimal(new BigDecimal(req.getFormAttribute("treibstoffverbrauch")))
      .addInteger(Integer.parseInt(req.getFormAttribute("frachtkapazitaet")))
      .addUUID(flugzeugId)
      .addUUID(besitzerId);

    client.preparedQuery(sql)
      .execute(tuple)
      .onSuccess(res -> {
        if (res.rowCount() == 0) {
          ctx.response().setStatusCode(403).end("Nicht berechtigt");
        } else {
          ctx.response().setStatusCode(200).end("Flugzeug aktualisiert");
        }
      })
      .onFailure(err -> {
        ctx.response().setStatusCode(500).end(err.getMessage());
      });
  }

  private void handleUpdateWithImage(
    RoutingContext ctx,
    UUID flugzeugId,
    UUID besitzerId,
    HttpServerRequest req,
    JsonObject abmasse,
    FileUpload upload
  ) {

    String filename = UUID.randomUUID() + "_" + upload.fileName();
    Path target = Paths.get("uploads/flugzeuge", filename);

    ctx.vertx().fileSystem()
      .move(upload.uploadedFileName(), target.toString())
      .onFailure(err -> {
        ctx.response().setStatusCode(500).end("Erreur upload image");
      })
      .onSuccess(v -> {

      String sql = """
      UPDATE flugzeug
      SET
        kennzeichen = $1,
        flugzeugtyp = $2,
        flugzeuggroesse = $3,
        abmasse = $4,
        bild = $5,
        flugstunden = $6,
        flugkilometer = $7,
        baujahr = $8,
        treibstoffverbrauch = $9,
        frachtkapazitaet = $10
      WHERE id = $11 AND flugzeugbesitzer_id = $12
    """;

      Tuple tuple = Tuple.tuple()
        .addString(req.getFormAttribute("kennzeichen"))
        .addString(req.getFormAttribute("flugzeugtyp"))
        .addString(req.getFormAttribute("flugzeuggroesse"))
        .addValue(abmasse.encode())
        .addString("/uploads/flugzeuge/" + filename)
        .addInteger(Integer.parseInt(req.getFormAttribute("flugstunden")))
        .addInteger(Integer.parseInt(req.getFormAttribute("flugkilometer")))
        .addInteger(Integer.parseInt(req.getFormAttribute("baujahr")))
        .addBigDecimal(new BigDecimal(req.getFormAttribute("treibstoffverbrauch")))
        .addInteger(Integer.parseInt(req.getFormAttribute("frachtkapazitaet")))
        .addUUID(flugzeugId)
        .addUUID(besitzerId);

      client.preparedQuery(sql)
        .execute(tuple)
        .onSuccess(res -> ctx.response().setStatusCode(200).end("Flugzeug aktualisiert"))
        .onFailure(err -> ctx.response().setStatusCode(500).end(err.getMessage()));
    });
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

    UUID flugzeugId = UUID.fromString(ctx.pathParam("id"));
    UUID flugzeugbesitzerId = UUID.fromString(ctx.get("flugzeugbesitzerId"));

    // ob das Flugzeug dem User gehört
    String sqlCheckOwner =
      "SELECT bild FROM flugzeug WHERE id = $1 AND flugzeugbesitzer_id = $2";

    client.preparedQuery(sqlCheckOwner)
      .execute(Tuple.of(flugzeugId, flugzeugbesitzerId))
      .compose(rows -> {
        if (!rows.iterator().hasNext()) {
          return Future.failedFuture("Flugzeug nicht gefunden oder nicht autorisiert");
        }
        String bildPfad = rows.iterator().next().getString("bild");
        ctx.put("bildPfad", bildPfad);
        return Future.succeededFuture();
      })
      // Überprüfe ob das Flugzeug keinen Stellplatz belegt
      .compose(v -> {
        String sqlCheckBooked =
          "SELECT 1 FROM flugzeug_zu_stellplatz WHERE flugzeug_id = $1 LIMIT 1";
        return client.preparedQuery(sqlCheckBooked).execute(Tuple.of(flugzeugId));
      })
      .compose(rows -> {
        if (rows.iterator().hasNext()) {
          return Future.failedFuture("Flugzeug ist aktuell reserviert oder belegt");
        }
        return Future.succeededFuture();
      })
      // 3) Suppression
      .compose(v -> {
        String sqlDelete = "DELETE FROM flugzeug WHERE id = $1";
        return client.preparedQuery(sqlDelete).execute(Tuple.of(flugzeugId));
      })
      .onSuccess(v -> {
        deleteBildIfExists(ctx.get("bildPfad"));
        ctx.response()
          .setStatusCode(200)
          .end("Flugzeug erfolgreich gelöscht");
      })
      .onFailure(err -> {
        if (err.getMessage().contains("reserviert") || err.getMessage().contains("belegt")) {
          ctx.response().setStatusCode(409).end(err.getMessage());
        } else {
          ctx.response().setStatusCode(500).end("Serverfehler");
        }
      });
  }

  //get flugzeuginfos
  private void getFlugzeugInfosHandler(RoutingContext ctx) {
    String idParam = ctx.pathParam("id");

    UUID flugzeugId;
    try {
      flugzeugId = UUID.fromString(idParam);
    } catch (IllegalArgumentException e) {
      ctx.response()
        .setStatusCode(400)
        .end("Ungültige Flugzeug-ID");
      return;
    }

    String sql = """
    SELECT *
    FROM flugzeug
    WHERE id = $1
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(flugzeugId))
      .onSuccess(rows -> {

        if (!rows.iterator().hasNext()) {
          ctx.response()
            .setStatusCode(404)
            .end("Flugzeug nicht gefunden");
          return;
        }

        Row row = rows.iterator().next();
        Flugzeug flugzeug = Flugzeug.fromRow(row);

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .end(flugzeug.toJson().encode());
      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response()
          .setStatusCode(500)
          .end("Datenbankfehler");
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

  //Hangaranbieter Controller
  private void getZusatzservicesHandler(RoutingContext ctx) {
    UUID hangaranbieterId;
    if (ctx.get("anbieterId")!=null){
      hangaranbieterId= ctx.get("anbieterId");
    }else{
      hangaranbieterId= UUID.fromString(ctx.pathParam("id"));
    }


    zusatzserviceRepository
      .findByHangaranbieterId(hangaranbieterId)
      .onSuccess(services -> ctx.response()
        .putHeader("Content-Type", "application/json")
        .end(services.encode())
      )
      .onFailure(err -> ctx.fail(500, err));
  }

  //Flugzeugbesitzer Zugriff

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

//eigene angebotene Stellplätze abrufen
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

  // Stellplatz suchen
  private void searchStellplaetzeHandler(RoutingContext ctx) {
    //System.out.println("Suchen demarre");
    String keyword = ctx.request().getParam("keyword");
    String ort = ctx.request().getParam("location");
    String flugzeugtyp = ctx.request().getParam("flugzeugtyp");
    String flugzeuggroesse = ctx.request().getParam("flugzeuggroesse");
    System.out.println("Sucht nach  "+ ort);


    StringBuilder sql = new StringBuilder("""
    SELECT
      s.id,
      s.kennzeichen,
      s.besonderheit,
      s.standort,
      s.availability,
      s.bild,
      s.flugzeugtyp,
      s.flugzeuggroesse,
      h.hangar_merkmale, h.firmenname,
      ARRAY_REMOVE(ARRAY_AGG(DISTINCT sv.bezeichnung), NULL) AS services
      FROM stellplatz s
      JOIN hangaranbieter h ON h.id = s.hangaranbieter_id
      LEFT JOIN service_zu_stellplatz szs ON szs.stellplatz_id = s.id
      LEFT JOIN service sv ON sv.id = szs.service_id
    WHERE s.availability = true
  """);

    List<Object> params = new java.util.ArrayList<>();
    int i = 1;

    if (keyword != null && !keyword.isBlank()) {
      sql.append(" AND (LOWER(s.besonderheit) LIKE $").append(i)
        .append(" OR LOWER(s.kennzeichen) LIKE $").append(i).append(")");
      params.add("%" + keyword.toLowerCase() + "%");
      i++;
    }

    if (ort != null && !ort.isBlank()) {
      sql.append(" AND LOWER(s.standort) LIKE $").append(i);
      params.add("%" + ort.toLowerCase() + "%");
      i++;
    }

    if (flugzeugtyp != null && !flugzeugtyp.isBlank()) {
      sql.append(" AND s.flugzeugtyp = $").append(i).append("::flugzeugtyp_enum");
      params.add(flugzeugtyp);
      i++;
    }

    if (flugzeuggroesse != null && !flugzeuggroesse.isBlank()) {
      sql.append(" AND s.flugzeuggroesse = $").append(i).append("::flugzeuggroesse_enum");
      params.add(flugzeuggroesse);
      i++;
    }
    sql.append(" GROUP BY s.id, h.id");



    client.preparedQuery(sql.toString())
      .execute(Tuple.tuple(params))
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response()
          .setStatusCode(500)
          .end("Fehler bei der Stellplatz-Suche");
      })
      .onSuccess(rows -> {

        JsonArray result = new JsonArray();

        rows.forEach(row ->
          result.add(buildStellplatzSearchJson(row))
        );

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .setStatusCode(200)
          .end(result.encode());
      });
  }
  private JsonArray extractEnabledMerkmale(JsonObject merkmale) {
    JsonArray result = new JsonArray();

    for (String key : merkmale.fieldNames()) {
      JsonObject obj = merkmale.getJsonObject(key);
      if (obj != null && obj.getBoolean("enabled", false)) {
        result.add(key);
      }
    }
    return result;
  }

  private JsonObject buildStellplatzSearchJson(io.vertx.sqlclient.Row row) {
    String merkmaleStr = row.getString("hangar_merkmale");
    JsonObject merkmale = merkmaleStr != null
      ? new JsonObject(merkmaleStr)
      : new JsonObject();

    String[] servicesArr = row.getArrayOfStrings("services");
    JsonArray services = new JsonArray();
    if (servicesArr != null) {
      for (String s : servicesArr) {
        services.add(s);
      }
    }

    return new JsonObject()
      .put("id", row.getUUID("id").toString())
      .put("kennzeichen", row.getString("kennzeichen"))
      .put("besonderheit", row.getString("besonderheit"))
      .put("ort", row.getString("standort"))
      .put("availability", row.getBoolean("availability"))
      .put("einstellbedingung", extractEnabledMerkmale(merkmale))
      .put("bild", row.getString("bild"))
      .put("flugzeugtyp", row.getString("flugzeugtyp"))
      .put("hangaranbieter", row.getString("firmenname"))
      .put("services", services)
      .put("flugzeuggroesse", row.getString("flugzeuggroesse"));
  }

  // Stellplatz-Details
  private void getStellplatzByIdHandler(RoutingContext ctx) {

    String idParam = ctx.pathParam("id");
    UUID stellplatzId;

    try {
      stellplatzId = UUID.fromString(idParam);
    } catch (IllegalArgumentException e) {
      ctx.response().setStatusCode(400).end("Ungültige Stellplatz-ID");
      return;
    }

    String sql = """
    SELECT
      s.id,
      s.standort,
      s.availability,
      s.bild,
      s.besonderheit,
      s.flugzeugtyp,
      s.flugzeuggroesse,
      h.id AS anbieter_id,
      h.firmenname,
      h.hangar_merkmale,
      COALESCE(
        jsonb_object_agg(
          sv.bezeichnung,
          jsonb_build_object(
            'price', asv.preis,
            'unit', asv.einheit
          )
        ) FILTER (WHERE sv.bezeichnung IS NOT NULL),
        '{}'::jsonb
      ) AS services
    FROM stellplatz s
    JOIN hangaranbieter h ON h.id = s.hangaranbieter_id
    LEFT JOIN service_zu_stellplatz szs ON szs.stellplatz_id = s.id
    LEFT JOIN service sv ON sv.id = szs.service_id
    LEFT JOIN angebotene_services asv
      ON asv.service_id = sv.id
     AND asv.hangaranbieter_id = h.id
    WHERE s.id = $1
    GROUP BY s.id, h.id
  """;

    client
      .preparedQuery(sql)
      .execute(Tuple.of(stellplatzId))
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response().setStatusCode(500).end("DB-Fehler");
      })
      .onSuccess(rows -> {

        if (!rows.iterator().hasNext()) {
          ctx.response().setStatusCode(404).end("Stellplatz nicht gefunden");
          return;
        }

        Row row = rows.iterator().next();
        UUID anbieterId = row.getUUID("anbieter_id");


        zusatzserviceRepository
          .findByHangaranbieterId(anbieterId)
          .onSuccess(zusatzservices -> {

            JsonObject response = buildStellplatzDetailJson(row)
              .put("zusatzservices", zusatzservices);

            ctx.response()
              .putHeader("Content-Type", "application/json")
              .end(response.encode());
          })
          .onFailure(err -> ctx.fail(500, err));

      });
  }
  private JsonObject buildStellplatzDetailJson(Row row) {

    // JSONB → String → JsonObject
    //JsonObject merkmale = new JsonObject(row.getString("hangar_merkmale"));
    //JsonObject services = new JsonObject(row.getString("services"));

    Object merkmaleObj = row.getValue("hangar_merkmale");
    Object servicesObj = row.getValue("services");

    JsonObject merkmale = (merkmaleObj instanceof JsonObject)
      ? (JsonObject) merkmaleObj
      : new JsonObject(merkmaleObj.toString());

    JsonObject services = (servicesObj instanceof JsonObject)
      ? (JsonObject) servicesObj
      : new JsonObject(servicesObj.toString());

    return new JsonObject()
      .put("id", row.getUUID("id"))
      .put("anbieterId", row.getUUID("anbieter_id"))
      .put("anbieterName", row.getString("firmenname"))
      .put("ort", row.getString("standort"))
      .put("availability", row.getBoolean("availability"))
      .put("bild", row.getString("bild"))
      .put("flugzeugtyp", row.getString("flugzeugtyp"))
      .put("flugzeuggroesse", row.getString("flugzeuggroesse"))
      .put("besonderheiten", row.getString("besonderheit"))
      .put("merkmale", merkmale)
      .put("services", services);
  }

  //Stellplatz reservieren
  private Future<Void> createReservierung(
    UUID flugzeugbesitzerId,
    UUID stellplatzId,
    UUID flugzeugId,
    LocalDate von,
    LocalDate bis
  ) {

  /* -------------------------------
     ob das Flugzeug dem Benutzer gehört
     ------------------------------- */
    String checkFlugzeugSql = """
    SELECT 1
    FROM flugzeug
    WHERE id = $1
      AND flugzeugbesitzer_id = $2
  """;

    return client.preparedQuery(checkFlugzeugSql)
      .execute(Tuple.of(flugzeugId, flugzeugbesitzerId))
      .compose(rows -> {
        if (!rows.iterator().hasNext()) {
          return Future.failedFuture("FLUGZEUG_NOT_OWNED");
        }

  /* -------------------------------
     2. Verfügbarkeit prüfen
     ------------------------------- */
        String checkAvailabilitySql = """
        SELECT 1
        FROM flugzeug_zu_stellplatz
        WHERE stellplatz_id = $1
          AND NOT (bis < $2 OR von > $3)
      """;

        return client.preparedQuery(checkAvailabilitySql)
          .execute(Tuple.of(stellplatzId, von, bis));
      })
      .compose(rows -> {
        if (rows.iterator().hasNext()) {
          return Future.failedFuture("STELLPLATZ_BELEGT");
        }

  /* -------------------------------
     3. Insert réservation
     ------------------------------- */
        String insertSql = """
        INSERT INTO flugzeug_zu_stellplatz
        (stellplatz_id, flugzeug_id, von, bis)
        VALUES ($1, $2, $3, $4)
      """;

        return client.preparedQuery(insertSql)
          .execute(Tuple.of(stellplatzId, flugzeugId, von, bis));
      })
      .compose(v -> {

  /* -------------------------------
     4. Flugzeug belegt
     ------------------------------- */
        String updateFlugzeugSql = """
        UPDATE flugzeug
        SET belegt = true
        WHERE id = $1
      """;

        return client.preparedQuery(updateFlugzeugSql)
          .execute(Tuple.of(flugzeugId));
      })
      .compose(v -> {

  /* -------------------------------
     Zustand initial
     ------------------------------- */
        String createZustandSql = """
        INSERT INTO zustand (flugzeug_id, stellplatz_id)
        VALUES ($1, $2)
      """;

        return client.preparedQuery(createZustandSql)
          .execute(Tuple.of(flugzeugId, stellplatzId));
      })
      .mapEmpty();
  }

  private void makeReservierung(RoutingContext ctx) {

    UUID flugzeugbesitzerId = ctx.get("flugzeugbesitzerId");

    JsonObject body = ctx.body().asJsonObject();
    if (body == null) {
      ctx.response().setStatusCode(400).end("Body fehlt");
      return;
    }

    UUID stellplatzId;
    UUID flugzeugId;

    LocalDate von;
    LocalDate bis;

    try {
      von = LocalDate.parse(body.getString("von"));
      bis = LocalDate.parse(body.getString("bis"));
    } catch (Exception e) {
      ctx.response()
        .setStatusCode(400)
        .end("Ungültige Daten  (YYYY-MM-DD)");
      return;
    }

    try {
      stellplatzId = UUID.fromString(body.getString("stellplatzId"));
      flugzeugId = UUID.fromString(body.getString("flugzeugId"));
    } catch (Exception e) {
      ctx.response().setStatusCode(400).end("Ungültige Daten");
      return;
    }

    if (von == null || bis == null) {
      ctx.response().setStatusCode(400).end("Zeitraum fehlt");
      return;
    }

    createReservierung(
      flugzeugbesitzerId,
      stellplatzId,
      flugzeugId,
      von,
      bis
    )
      .onSuccess(v ->
        ctx.response()
          .setStatusCode(201)
          .end(new JsonObject()
            .put("message", "Reservierung erfolgreich erstellt")
            .encode())
      )
      .onFailure(err -> {
        switch (err.getMessage()) {
          case "FLUGZEUG_NOT_OWNED" ->
            ctx.response().setStatusCode(403).end("Flugzeug gehört nicht dem Benutzer");
          case "STELLPLATZ_BELEGT" ->
            ctx.response().setStatusCode(409).end("Stellplatz im Zeitraum belegt");
          default -> {
            err.printStackTrace();
            ctx.response().setStatusCode(500).end("Serverfehler");
          }
        }
      });

  }

  //belegte Flugzeuge
  private void getBelegteStellplaetzeHandler(RoutingContext ctx) {

    UUID anbieterId = ctx.get("anbieterId");

    String sql = """
    SELECT
      f.id           AS flugzeug_id,
      f.bild         AS flugzeug_bild,
      f.flugzeugtyp,
      f.flugzeuggroesse,
      f.kennzeichen  AS flugzeug_kennzeichen,

      s.id           AS stellplatz_id,
      s.kennzeichen  AS stellplatz_kennzeichen,
      s.hangaranbieter_id,

      fs.von,
      fs.bis
    FROM stellplatz s
    JOIN flugzeug_zu_stellplatz fs
      ON fs.stellplatz_id = s.id
    JOIN flugzeug f
      ON f.id = fs.flugzeug_id
    WHERE s.hangaranbieter_id = $1
    ORDER BY fs.von DESC
  """;

    client
      .preparedQuery(sql)
      .execute(Tuple.of(anbieterId))
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response()
          .setStatusCode(500)
          .end("Fehler beim Laden der belegten Stellplätze");
      })
      .onSuccess(rows -> {

        JsonArray result = new JsonArray();

        for (Row row : rows) {

          JsonObject flugzeug = new JsonObject()
            .put("id", row.getUUID("flugzeug_id"))
            .put("bild", row.getString("flugzeug_bild"))
            .put("flugzeugtyp", row.getString("flugzeugtyp"))
            .put("flugzeuggroesse", row.getString("flugzeuggroesse"))
            .put("kennzeichen", row.getString("flugzeug_kennzeichen"));

          JsonObject stellplatz = new JsonObject()
            .put("id", row.getUUID("stellplatz_id"))
            .put("kennzeichen", row.getString("stellplatz_kennzeichen"))
            .put("hangaranbieter_id",
              row.getUUID("hangaranbieter_id"));

          JsonObject entry = new JsonObject()
            .put("flugzeug", flugzeug)
            .put("stellplatz", stellplatz)
            .put("von", row.getLocalDate("von").toString())
            .put("bis", row.getLocalDate("bis").toString());

          result.add(entry);
        }

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .setStatusCode(200)
          .end(result.encode());
      });
  }

  //Fahrbereitschaft aktualisieren
  private void updateFahrbereitschaftHandler(RoutingContext ctx) {

    JsonObject body = ctx.body().asJsonObject();

    if (body == null) {
      ctx.response().setStatusCode(400).end("Body fehlt");
      return;
    }

    UUID flugzeugId;
    UUID stellplatzId;

    try {
      flugzeugId = UUID.fromString(body.getString("flugzeugId"));
      stellplatzId = UUID.fromString(body.getString("stellplatzId"));
    } catch (Exception e) {
      ctx.response().setStatusCode(400).end("Ungültige IDs");
      return;
    }

    String fahrbereitschaft = body.getString("fahrbereitschaft");
    String beschreibung = body.getString("beschreibung");

    if (fahrbereitschaft == null || fahrbereitschaft.isBlank()) {
      ctx.response()
        .setStatusCode(400)
        .end("Fahrbereitschaft ist erforderlich");
      return;
    }

    String sql = """
    UPDATE zustand
    SET
      fahrbereitschaft = $1,
      beschreibung = COALESCE($2, beschreibung)
    WHERE flugzeug_id = $3
      AND stellplatz_id = $4
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(
        fahrbereitschaft,
        beschreibung,
        flugzeugId,
        stellplatzId
      ))
      .onSuccess(res -> {

        if (res.rowCount() == 0) {
          ctx.response()
            .setStatusCode(404)
            .end("Zustand nicht gefunden");
          return;
        }

        ctx.response()
          .setStatusCode(200)
          .putHeader("Content-Type", "application/json")
          .end(new JsonObject()
            .put("message", "Fahrbereitschaft erfolgreich aktualisiert")
            .encode());
      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response()
          .setStatusCode(500)
          .end("Serverfehler");
      });
  }

// FlugzeugInfos abrufen
  private void getFlugzeugDetailsHandler(RoutingContext ctx){
    UUID flugzeugId;
    try {
      flugzeugId = UUID.fromString(ctx.pathParam("id"));
    } catch (IllegalArgumentException e) {
      ctx.response().setStatusCode(400).end("Ungültige Flugzeug-ID");
      return;
    }

    UUID flugzeugbesitzerId = ctx.get("flugzeugbesitzerId");
    String sqlCheck = """
  SELECT *
  FROM flugzeug
  WHERE id = $1
    AND flugzeugbesitzer_id = $2
""";

    client.preparedQuery(sqlCheck)
      .execute(Tuple.of(flugzeugId, flugzeugbesitzerId))
      .compose(rows -> {

        if (!rows.iterator().hasNext()) {
          return Future.failedFuture("FORBIDDEN");
        }

        Row row = rows.iterator().next();
        Flugzeug flugzeug = Flugzeug.fromRow(row);

        JsonObject result = new JsonObject();
        result.put("flugzeug", flugzeug.toJson());

        return loadHangarInfos(flugzeugId,flugzeugbesitzerId, result);
      })
      .onSuccess(result ->
        ctx.response()
          .putHeader("Content-Type", "application/json")
          .setStatusCode(200)
          .end(result.encode())
      )
      .onFailure(err -> {
        if ("FORBIDDEN".equals(err.getMessage())) {
          ctx.response().setStatusCode(403).end("Kein Zugriff auf dieses Flugzeug");
        } else {
          err.printStackTrace();
          ctx.response().setStatusCode(500).end("Serverfehler");
        }
      });


  }

  private Future<JsonObject> loadHangarInfos(UUID flugzeugId, UUID flugzeugbesitzerId, JsonObject result) {

    String sql = """
    SELECT
      s.id AS stellplatz_id,
      s.kennzeichen AS stellplatz_kennzeichen,
      s.besonderheit,
      s.standort,
      h.id AS hangaranbieter_id,
      h.firmenname,
      fs.von,
      fs.bis
    FROM flugzeug_zu_stellplatz fs
    JOIN stellplatz s ON s.id = fs.stellplatz_id
    JOIN hangaranbieter h ON h.id = s.hangaranbieter_id
    WHERE fs.flugzeug_id = $1
  """;

    return client.preparedQuery(sql)
      .execute(Tuple.of(flugzeugId))
      .compose(rows -> {

        if (!rows.iterator().hasNext()) {
          result.put("hangar", null);
          //System.out.println(result);
          return loadZustand(flugzeugId, null, result);
        }

        Row row = rows.iterator().next();
        UUID stellplatzId = row.getUUID("stellplatz_id");
        UUID anbieterID = row.getUUID("hangaranbieter_id");

        JsonObject hangar = new JsonObject()
          .put("stellplatz_id", stellplatzId.toString())
          .put("stellplatzKennzeichen", row.getString("stellplatz_kennzeichen"))
          .put("besonderheit", row.getString("besonderheit"))
          .put("hangaranbieterId", row.getUUID("hangaranbieter_id").toString())
          .put("hangaranbieter", row.getString("firmenname"))
          .put("ort", row.getString("standort"))
          .put("von", row.getLocalDate("von") != null ? row.getLocalDate("von").toString() : null)
          .put("bis", row.getLocalDate("bis") != null ? row.getLocalDate("bis").toString() : null)
          .put("services", new JsonArray())
          .put("zusatzservices", new JsonArray());

        result.put("hangar", hangar);

        return loadServices(stellplatzId, anbieterID, result)
          .compose(v -> loadZusatzservices(stellplatzId, flugzeugId, result))
          .compose(v -> loadTermine(stellplatzId,flugzeugbesitzerId, anbieterID, result))
          .compose(v -> loadZustand(flugzeugId, stellplatzId, result));

      });
  }

  private Future<Void> loadServices(UUID stellplatzId, UUID anbieterID, JsonObject result) {

    String sql = """
    SELECT s.bezeichnung, a.preis, a.einheit
    FROM service_zu_stellplatz szs
    JOIN service s ON s.id = szs.service_id
    JOIN angebotene_services a ON a.service_id = s.id
    WHERE szs.stellplatz_id = $1 AND a.hangaranbieter_id = $2
  """;

    return client.preparedQuery(sql)
      .execute(Tuple.of(stellplatzId, anbieterID))
      .onSuccess(rows -> {
        JsonArray services = new JsonArray();

        rows.forEach(row -> {
          services.add(new JsonObject()
            .put("bezeichnung", row.getString("bezeichnung"))
            .put("preis", row.getBigDecimal("preis") != null
              ? row.getBigDecimal("preis").doubleValue()
              : null)
            .put("einheit", row.getString("einheit")));
        });

        result.getJsonObject("hangar").put("services", services);
      })
      .mapEmpty();
  }

  private Future<JsonObject> loadZustand(
    UUID flugzeugId,
    UUID stellplatzId,
    JsonObject result
  ) {

    if (stellplatzId == null) {
      result.put("zustand", null);
      return Future.succeededFuture(result);
    }

    String sql = """
    SELECT fahrbereitschaft, beschreibung, wartung
    FROM zustand
    WHERE flugzeug_id = $1
      AND stellplatz_id = $2
  """;

    return client.preparedQuery(sql)
      .execute(Tuple.of(flugzeugId, stellplatzId))
      .map(rows -> {

        JsonObject zustand = null;

        if (rows.iterator().hasNext()) {
          Row r = rows.iterator().next();
          zustand = new JsonObject()
            .put("fahrbereitschaft", r.getString("fahrbereitschaft"))
            .put("beschreibung", r.getString("beschreibung"))
            .put("wartungszustand", r.getString("wartung"));
        }

        result.put("zustand", zustand);
        //System.out.println(result);
        return result;
      });
  }
  private Future<Void> loadZusatzservices(
    UUID stellplatzId,
    UUID flugzeugId,
    JsonObject result
  ) {

    String sql = """
    SELECT
      zs.id,
      zs.bezeichnung,
      zs.preis,
      zs.einheit
    FROM gebuchter_zusatzservice gzs
    JOIN zusatzservice zs ON zs.id = gzs.zusatzservice_id
    WHERE gzs.stellplatz_id = $1
      AND gzs.flugzeug_id = $2
  """;

    return client
      .preparedQuery(sql)
      .execute(Tuple.of(stellplatzId, flugzeugId))
      .onSuccess(rows -> {

        JsonArray zusatzservices = new JsonArray();

        rows.forEach(row -> {
          zusatzservices.add(new JsonObject()
            .put("id", row.getInteger("id"))
            .put("bezeichnung", row.getString("bezeichnung"))
            .put("preis", row.getBigDecimal("preis").doubleValue())
            .put("einheit", row.getString("einheit"))
          );
        });

        result
          .getJsonObject("hangar")
          .put("zusatzservices", zusatzservices);
      })
      .mapEmpty();
  }

  private Future<Void> loadTermine(
    UUID stellplatzId,
    UUID flugzeugbesitzerID,
    UUID anbieterID,
    JsonObject result
  ) {

    String sql = """
    SELECT termin_zeitpunkt, ist_uebergabe
    FROM uebergabe_rueckgabe_termin
    WHERE stellplatz_id = $1
      AND flugzeugbesitzer_id = $2
      AND hangaranbieter_id = $3
  """;

    return client
      .preparedQuery(sql)
      .execute(Tuple.of(stellplatzId, flugzeugbesitzerID,anbieterID))
      .onSuccess(rows -> {

        JsonObject hangar = result.getJsonObject("hangar");

        rows.forEach(row -> {
          String termin = row
            .getOffsetDateTime("termin_zeitpunkt")
            .toString();

          if (row.getBoolean("ist_uebergabe")) {
            hangar.put("uebergabetermin", termin);
          } else {
            hangar.put("rueckgabetermin", termin);
          }
        });
      })
      .mapEmpty();
  }



  //create Service
  private void createAngeboteneServicesHandler(RoutingContext ctx) {

    UUID hangaranbieterId = ctx.get("anbieterId");
    JsonArray body = ctx.body().asJsonArray();

    if (body == null || body.isEmpty()) {
      ctx.response().setStatusCode(400).end("Keine Services übergeben");
      return;
    }

    String sql = """
    INSERT INTO angebotene_services
      (hangaranbieter_id, service_id, preis, einheit)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (hangaranbieter_id, service_id) DO NOTHING
  """;

    Future<Void> chain = Future.succeededFuture();

    for (int i = 0; i < body.size(); i++) {
      JsonObject s = body.getJsonObject(i);

      Integer serviceId = s.getInteger("serviceId");
      Double preis = s.getDouble("preis");
      String einheit = s.getString("einheit");

      if (serviceId == null || preis == null || einheit == null) {
        ctx.response().setStatusCode(400).end("Ungültige Service-Daten");
        return;
      }

      chain = chain.compose(v ->
        client.preparedQuery(sql)
          .execute(Tuple.of(
            hangaranbieterId,
            serviceId,
            preis,
            einheit
          ))
          .mapEmpty()
      );
    }

    chain
      .onSuccess(v ->
        ctx.response()
          .setStatusCode(201)
          .putHeader("Content-Type", "application/json")
          .end(new JsonObject()
            .put("message", "Services erfolgreich hinzugefügt")
            .encode())
      )
      .onFailure(err -> ctx.fail(500, err));
  }

  //update Service Infos
  private void updateAngeboteneServicesHandler(RoutingContext ctx) {

    UUID hangaranbieterId = ctx.get("anbieterId");
    JsonObject body = ctx.body().asJsonObject();

    Integer serviceId = body.getInteger("serviceId");
    Double preis = body.getDouble("preis");
    String einheit = body.getString("einheit");

    if (serviceId == null || preis == null || einheit == null) {
      ctx.response().setStatusCode(400).end("Ungültige Daten");
      return;
    }

    String sql = """
    UPDATE angebotene_services
    SET preis = $1,
        einheit = $2
    WHERE hangaranbieter_id = $3
      AND service_id = $4
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(
        preis,
        einheit,
        hangaranbieterId,
        serviceId
      ))
      .onSuccess(res -> {
        if (res.rowCount() == 0) {
          ctx.response().setStatusCode(404).end("Service nicht gefunden");
        } else {
          ctx.response()
            .setStatusCode(200)
            .putHeader("Content-Type", "application/json")
            .end(new JsonObject()
              .put("message", "Service erfolgreich aktualisiert")
              .encode());
        }
      })
      .onFailure(err -> ctx.fail(500, err));
  }

  //delete Service
  private void deleteAngeboteneServiceHandler(RoutingContext ctx) {

    UUID hangaranbieterId = ctx.get("anbieterId");

    Integer serviceId;
    try {
      serviceId = Integer.parseInt(ctx.pathParam("id"));
    } catch (NumberFormatException e) {
      ctx.response()
        .setStatusCode(400)
        .end("Ungültige Service-ID");
      return;
    }

    String sql = """
    DELETE FROM angebotene_services
    WHERE hangaranbieter_id = $1
      AND service_id = $2
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(hangaranbieterId, serviceId))
      .onSuccess(res -> {
        if (res.rowCount() == 0) {
          ctx.response()
            .setStatusCode(404)
            .end("Service nicht gefunden oder kein Zugriff");
        } else {
          ctx.response()
            .setStatusCode(200)
            .putHeader("Content-Type", "application/json")
            .end(new JsonObject()
              .put("message", "Service erfolgreich gelöscht")
              .encode());
        }
      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response()
          .setStatusCode(500)
          .end("Fehler beim Löschen des Services");
      });
  }

// Zusatzservice buchen
private void buchZusatzserviceHandler(RoutingContext ctx) {

  JsonObject body = ctx.body().asJsonObject();
  if (body == null) {
    ctx.response().setStatusCode(400).end("Body fehlt");
    return;
  }

  UUID stellplatzId;
  UUID flugzeugId;
  Integer zusatzserviceId;

  try {
    stellplatzId = UUID.fromString(body.getString("stellplatz_id"));
    flugzeugId = UUID.fromString(body.getString("flugzeug_id"));
    zusatzserviceId = body.getInteger("zusatzservice_id");
  } catch (Exception e) {
    ctx.response().setStatusCode(400).end("invalid Payload");
    return;
  }

  String sql = """
    INSERT INTO gebuchter_zusatzservice (
      stellplatz_id,
      zusatzservice_id,
      flugzeug_id
    )
    VALUES ($1, $2, $3)
  """;

  client
    .preparedQuery(sql)
    .execute(Tuple.of(stellplatzId, zusatzserviceId, flugzeugId))
    .onSuccess(res -> {
      ctx.response()
        .setStatusCode(201)
        .end();
    })
    .onFailure(err -> {

      // UNICITY
      if (err.getMessage() != null && err.getMessage().contains("unique")) {
        ctx.response()
          .setStatusCode(409)
          .end("Zusatzservice bereits gebucht");
        return;
      }

      err.printStackTrace();
      ctx.response()
        .setStatusCode(500)
        .end("Fehler beim Buchen des Zusatzservices");
    });
}


  //create Zusatzservice
  private void createZusatzserviceHandler(RoutingContext ctx) {

    UUID hangaranbieterId = ctx.get("anbieterId");
    JsonObject body = ctx.body().asJsonObject();

    String bezeichnung = body.getString("bezeichnung");
    String beschreibung = body.getString("beschreibung");
    Double preis = body.getDouble("preis");
    String einheit = body.getString("einheit");

    if (bezeichnung == null || preis == null || einheit == null) {
      ctx.response().setStatusCode(400).end("Pflichtfelder fehlen");
      return;
    }

    String sql = """
    INSERT INTO zusatzservice
      (bezeichnung, beschreibung, hangaranbieter_id, preis, einheit)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(
        bezeichnung,
        beschreibung,
        hangaranbieterId,
        preis,
        einheit
      ))
      .onSuccess(rows -> {
        Integer id = rows.iterator().next().getInteger("id");

        ctx.response()
          .setStatusCode(201)
          .putHeader("Content-Type", "application/json")
          .end(new JsonObject()
            .put("id", id)
            .put("message", "Zusatzservice erstellt")
            .encode());
      })
      .onFailure(err -> ctx.fail(500, err));
  }

  // Zusatzservice updaten
  private void updateZusatzserviceHandler(RoutingContext ctx) {

    UUID hangaranbieterId = ctx.get("anbieterId");
    JsonObject body = ctx.body().asJsonObject();

    Integer id = body.getInteger("id");
    String bezeichnung = body.getString("bezeichnung");
    String beschreibung = body.getString("beschreibung");
    Double preis = body.getDouble("preis");
    String einheit = body.getString("einheit");

    if (id == null || bezeichnung == null || preis == null || einheit == null) {
      ctx.response().setStatusCode(400).end("Ungültige Daten");
      return;
    }

    String sql = """
    UPDATE zusatzservice
    SET bezeichnung = $1,
        beschreibung = $2,
        preis = $3,
        einheit = $4
    WHERE id = $5
      AND hangaranbieter_id = $6
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(
        bezeichnung,
        beschreibung,
        preis,
        einheit,
        id,
        hangaranbieterId
      ))
      .onSuccess(res -> {
        if (res.rowCount() == 0) {
          ctx.response().setStatusCode(404).end("Zusatzservice nicht gefunden");
        } else {
          ctx.response()
            .setStatusCode(200)
            .putHeader("Content-Type", "application/json")
            .end(new JsonObject()
              .put("message", "Zusatzservice aktualisiert")
              .encode());
        }
      })
      .onFailure(err -> ctx.fail(500, err));
  }

  //zusatzservice löschen
  private void deleteZusatzserviceHandler(RoutingContext ctx) {

    UUID hangaranbieterId = ctx.get("anbieterId");

    Integer zusatzserviceId;
    try {
      zusatzserviceId = Integer.parseInt(ctx.pathParam("id"));
    } catch (NumberFormatException e) {
      ctx.response()
        .setStatusCode(400)
        .end("Ungültige Zusatzservice-ID");
      return;
    }

    String sql = """
    DELETE FROM zusatzservice
    WHERE id = $1
      AND hangaranbieter_id = $2
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(zusatzserviceId, hangaranbieterId))
      .onSuccess(res -> {
        if (res.rowCount() == 0) {
          ctx.response()
            .setStatusCode(404)
            .end("Zusatzservice nicht gefunden oder kein Zugriff");
        } else {
          ctx.response()
            .setStatusCode(200)
            .putHeader("Content-Type", "application/json")
            .end(new JsonObject()
              .put("message", "Zusatzservice erfolgreich gelöscht")
              .encode());
        }
      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response()
          .setStatusCode(500)
          .end("Fehler beim Löschen des Zusatzservices");
      });
  }

  // Reservierungen
  private void getReservierungenHandler(RoutingContext ctx) {

    UUID hangaranbieterId = ctx.get("anbieterId");

    String sql = """
    SELECT
      sp.id                AS stellplatz_id,
      sp.kennzeichen       AS stellplatz_kennzeichen,
      sp.standort          AS stellplatz_standort,

      f.id                 AS flugzeug_id,
      f.kennzeichen        AS flugzeug_kennzeichen,

      fb.id                AS besitzer_id,
      b.name               AS besitzer_name,
      b.email              AS besitzer_email,

      fzs.von,
      fzs.bis
    FROM flugzeug_zu_stellplatz fzs
    JOIN stellplatz sp
      ON sp.id = fzs.stellplatz_id
    JOIN flugzeug f
      ON f.id = fzs.flugzeug_id
    JOIN flugzeugbesitzer fb
      ON fb.id = f.flugzeugbesitzer_id
    JOIN benutzer b
      ON b.id = fb.benutzer_id
    WHERE sp.hangaranbieter_id = $1
    ORDER BY fzs.von DESC
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(hangaranbieterId))
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response()
          .setStatusCode(500)
          .end("Fehler beim Laden der Reservierungen");
      })
      .onSuccess(rows -> {

        JsonArray result = new JsonArray();

        rows.forEach(row -> {

          JsonObject reservierung = new JsonObject()

            .put("stellplatz", new JsonObject()
              .put("id", row.getUUID("stellplatz_id").toString())
              .put("kennzeichen", row.getString("stellplatz_kennzeichen"))
              .put("standort", row.getString("stellplatz_standort"))
            )

            .put("flugzeug", new JsonObject()
              .put("id", row.getUUID("flugzeug_id").toString())
              .put("kennzeichen", row.getString("flugzeug_kennzeichen"))
            )

            .put("flugzeugbesitzer", new JsonObject()
              .put("id", row.getUUID("besitzer_id").toString())
              .put("name", row.getString("besitzer_name"))
              .put("email", row.getString("besitzer_email"))
            )

            .put("zeitraum", new JsonObject()
              .put("von", row.getLocalDate("von").toString())
              .put("bis", row.getLocalDate("bis").toString())
            );

          result.add(reservierung);
        });

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .setStatusCode(200)
          .end(result.encode());
      });
  }

  //eine Reservierung stornieren
  private void deleteReservierungHandler(RoutingContext ctx) {
    UUID anbieterId = ctx.get("anbieterId");

    JsonObject body = ctx.body().asJsonObject();
    if (body == null) {
      ctx.response().setStatusCode(400).end("Request body fehlt");
      return;
    }

    UUID stellplatzId;
    UUID flugzeugId;

    try {
      stellplatzId = UUID.fromString(body.getString("stellplatzId"));
      flugzeugId = UUID.fromString(body.getString("flugzeugId"));
    } catch (Exception e) {
      ctx.response().setStatusCode(400).end("Ungültige UUID");
      return;
    }

    /*
     * Prüfen: gehört der Stellplatz diesem Hangaranbieter?
     */
    String checkOwnershipSql = """
    SELECT 1
    FROM stellplatz
    WHERE id = $1 AND hangaranbieter_id = $2
  """;

    client.preparedQuery(checkOwnershipSql)
      .execute(Tuple.of(stellplatzId, anbieterId))
      .compose(rows -> {
        if (!rows.iterator().hasNext()) {
          return Future.failedFuture("FORBIDDEN");
        }

        /*
         * Reservierung löschen
         */
        String deleteSql = """
        DELETE FROM flugzeug_zu_stellplatz
        WHERE stellplatz_id = $1 AND flugzeug_id = $2
      """;

        return client.preparedQuery(deleteSql)
          .execute(Tuple.of(stellplatzId, flugzeugId));
      })
      .compose(deleteResult -> {
        if (deleteResult.rowCount() == 0) {
          return Future.failedFuture("NOT_FOUND");
        }

        //UPDATE Flugzeug status
        String updateFlugzeugSql = """
        UPDATE flugzeug
        SET belegt = false
        WHERE id = $1
      """;

        return client.preparedQuery(updateFlugzeugSql)
          .execute(Tuple.of(flugzeugId));
      })
      .onSuccess(res -> {
        if (res.rowCount() == 0) {
          ctx.response().setStatusCode(404).end("Reservierung nicht gefunden");
        } else {
          ctx.response()
            .setStatusCode(200)
            .putHeader("Content-Type", "application/json")
            .end(new JsonObject()
              .put("message", "Reservierung erfolgreich gelöscht")
              .encode()
            );
        }
      })
      .onFailure(err -> {
        if ("FORBIDDEN".equals(err.getMessage())) {
          ctx.response().setStatusCode(403).end("Kein Zugriff auf diesen Stellplatz");
        } else {
          err.printStackTrace();
          ctx.response().setStatusCode(500).end("Serverfehler");
        }
      });
  }

  //Angebot anfordern
  private void createAngebotAnfrageHandler(RoutingContext ctx) {

    UUID flugzeugbesitzerId = ctx.get("flugzeugbesitzerId");

    JsonObject body = ctx.body().asJsonObject();
    if (body == null) {
      ctx.response().setStatusCode(400).end("Body fehlt");
      return;
    }

    try {
      UUID stellplatzId = UUID.fromString(body.getString("stellplatz_id"));
      UUID hangaranbieterId = UUID.fromString(body.getString("hangaranbieter_id"));
      UUID flugzeugId = UUID.fromString(body.getString("flugzeug_id"));

      LocalDate von = LocalDate.parse(body.getString("von"));
      LocalDate bis = LocalDate.parse(body.getString("bis"));

      if (bis.isBefore(von)) {
        ctx.response()
          .setStatusCode(400)
          .end("Ungültiger Zeitraum (bis < von)");
        return;
      }

      String sql = """
      INSERT INTO angebot (
        stellplatz_id,
        flugzeug_id,
        flugzeugbesitzer_id,
        hangaranbieter_id,
        von,
        bis,
        accepted
      )
      VALUES ($1, $2, $3, $4, $5, $6, NULL)
      RETURNING id
    """;

      client.preparedQuery(sql)
        .execute(Tuple.of(
          stellplatzId,
          flugzeugId,
          flugzeugbesitzerId,
          hangaranbieterId,
          von,
          bis
        ))
        .onSuccess(rows -> {

          Integer angebotId = rows.iterator().next().getInteger("id");

          ctx.response()
            .setStatusCode(201)
            .putHeader("Content-Type", "application/json")
            .end(new JsonObject()
              .put("message", "Angebotsanfrage erfolgreich erstellt")
              .put("angebot_id", angebotId)
              .encode()
            );
        })
        .onFailure(err -> {

          // 🔒 Contrainte UNIQUE violée
          if (err.getMessage() != null &&
            err.getMessage().contains("angebot_unique_pro_zeitraum")) {

            ctx.response()
              .setStatusCode(409)
              .end("Für diesen Zeitraum existiert bereits ein Angebot");
            return;
          }

          err.printStackTrace();
          ctx.response()
            .setStatusCode(500)
            .end("Serverfehler beim Erstellen des Angebots");
        });

    } catch (Exception e) {
      ctx.response()
        .setStatusCode(400)
        .end("Ungültige Parameter");
    }
  }

  //GET ANGEBOTE
  private void getMyAnsweredAngeboteHandler(RoutingContext ctx) {

    UUID flugzeugbesitzerId = ctx.get("flugzeugbesitzerId");

    String sql = """
    SELECT
      a.id,
      a.accepted,
      a.inhalt,
      a.von,
      a.bis,

      s.id            AS stellplatz_id,
      s.kennzeichen   AS stellplatz_kennzeichen,
      s.standort      AS stellplatz_standort,

      f.id            AS flugzeug_id,
      f.kennzeichen   AS flugzeug_kennzeichen,

      fb.id           AS flugzeugbesitzer_id,
      b.name          AS flugzeugbesitzer_name,
      b.email         AS flugzeugbesitzer_email

    FROM angebot a
    JOIN stellplatz s        ON s.id = a.stellplatz_id
    JOIN flugzeug f          ON f.id = a.flugzeug_id
    JOIN flugzeugbesitzer fb ON fb.id = a.flugzeugbesitzer_id
    JOIN benutzer b          ON b.id = fb.benutzer_id

    WHERE a.flugzeugbesitzer_id = $1
      AND a.inhalt IS NOT NULL

    ORDER BY a.von DESC
  """;

    client
      .preparedQuery(sql)
      .execute(Tuple.of(flugzeugbesitzerId))
      .onSuccess(rows -> {

        JsonArray result = new JsonArray();

        for (Row row : rows) {

          JsonObject angebot = new JsonObject()
            .put("id", row.getInteger("id"))
            .put("accepted", row.getBoolean("accepted"))
            .put("inhalt", row.getString("inhalt"))
            .put("stellplatz", new JsonObject()
              .put("id", row.getUUID("stellplatz_id").toString())
              .put("kennzeichen", row.getString("stellplatz_kennzeichen"))
              .put("standort", row.getString("stellplatz_standort"))
            )
            .put("flugzeug", new JsonObject()
              .put("id", row.getUUID("flugzeug_id").toString())
              .put("kennzeichen", row.getString("flugzeug_kennzeichen"))
            )
            .put("flugzeugbesitzer", new JsonObject()
              .put("id", row.getUUID("flugzeugbesitzer_id").toString())
              .put("name", row.getString("flugzeugbesitzer_name"))
              .put("email", row.getString("flugzeugbesitzer_email"))
            )
            .put("zeitraum", new JsonObject()
              .put("von", row.getLocalDate("von").toString())
              .put("bis", row.getLocalDate("bis").toString())
            );

          result.add(angebot);
        }

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .end(result.encode());
      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response()
          .setStatusCode(500)
          .end("Fehler beim Laden der Angebote");
      });
  }

  // Angebote annehmen
  private void acceptAngebotHandler(RoutingContext ctx) {

    UUID flugzeugbesitzerId = ctx.get("flugzeugbesitzerId");
    int angebotId;

    try {
      angebotId = Integer.parseInt(ctx.pathParam("id"));
    } catch (Exception e) {
      ctx.response().setStatusCode(400).end("Ungültige Angebots-ID");
      return;
    }

    String selectSql = """
    SELECT stellplatz_id, flugzeug_id, von, bis, accepted
    FROM angebot
    WHERE id = $1
      AND flugzeugbesitzer_id = $2
  """;

    client.preparedQuery(selectSql)
      .execute(Tuple.of(angebotId, flugzeugbesitzerId))
      .compose(rows -> {
        if (!rows.iterator().hasNext()) {
          return Future.failedFuture("ANGEBOT_NOT_FOUND");
        }

        Row row = rows.iterator().next();

        if (Boolean.TRUE.equals(row.getBoolean("accepted"))) {
          return Future.failedFuture("ANGEBOT_ALREADY_ACCEPTED");
        }

        UUID stellplatzId = row.getUUID("stellplatz_id");
        UUID flugzeugId   = row.getUUID("flugzeug_id");
        LocalDate von     = row.getLocalDate("von");
        LocalDate bis     = row.getLocalDate("bis");

        String updateSql = """
        UPDATE angebot
        SET accepted = true
        WHERE id = $1
      """;

        return client.preparedQuery(updateSql)
          .execute(Tuple.of(angebotId))
          .compose(v ->
            createReservierung(
              flugzeugbesitzerId,
              stellplatzId,
              flugzeugId,
              von,
              bis
            )
          );
      })
      .onSuccess(v ->
        ctx.response()
          .setStatusCode(200)
          .end(new JsonObject()
            .put("message", "Angebot akzeptiert und reserviert")
            .encode())
      )
      .onFailure(err -> {
        switch (err.getMessage()) {
          case "ANGEBOT_NOT_FOUND" ->
            ctx.response().setStatusCode(404).end("Angebot nicht gefunden");
          case "ANGEBOT_ALREADY_ACCEPTED" ->
            ctx.response().setStatusCode(409).end("Angebot bereits akzeptiert");
          case "FLUGZEUG_NOT_OWNED" ->
            ctx.response().setStatusCode(403).end("Flugzeug gehört nicht dem Benutzer");
          case "STELLPLATZ_BELEGT" ->
            ctx.response().setStatusCode(409).end("Stellplatz im Zeitraum belegt");
          default -> {
            err.printStackTrace();
            ctx.response().setStatusCode(500).end("Serverfehler");
          }
        }
      });
  }

  // Angebot ablehnen
  private void denyAngebotHandler(RoutingContext ctx) {

    UUID flugzeugbesitzerId = ctx.get("flugzeugbesitzerId");
    int angebotId;

    try {
      angebotId = Integer.parseInt(ctx.pathParam("id"));
    } catch (Exception e) {
      ctx.response().setStatusCode(400).end("Ungültige Angebots-ID");
      return;
    }

  /* -----------------------------------
     ob das Abgebot dem Benutzer gehört
     ----------------------------------- */
    String selectSql = """
    SELECT accepted
    FROM angebot
    WHERE id = $1
      AND flugzeugbesitzer_id = $2
  """;

    client.preparedQuery(selectSql)
      .execute(Tuple.of(angebotId, flugzeugbesitzerId))
      .compose(rows -> {
        if (!rows.iterator().hasNext()) {
          return Future.failedFuture("ANGEBOT_NOT_FOUND");
        }

        Row row = rows.iterator().next();
        Boolean accepted = row.getBoolean("accepted");

        if (accepted != null) {
          return Future.failedFuture("ANGEBOT_ALREADY_DECIDED");
        }

  /* -----------------------------------
     update Spalte accepted
     ----------------------------------- */
        String updateSql = """
        UPDATE angebot
        SET accepted = false
        WHERE id = $1
      """;

        return client.preparedQuery(updateSql)
          .execute(Tuple.of(angebotId));
      })
      .onSuccess(v ->
        ctx.response()
          .setStatusCode(200)
          .putHeader("Content-Type", "application/json")
          .end(new JsonObject()
            .put("message", "Angebot wurde abgelehnt")
            .encode())
      )
      .onFailure(err -> {
        switch (err.getMessage()) {
          case "ANGEBOT_NOT_FOUND" ->
            ctx.response().setStatusCode(404).end("Angebot nicht gefunden");
          case "ANGEBOT_ALREADY_DECIDED" ->
            ctx.response().setStatusCode(409).end("Angebot wurde bereits bearbeitet");
          default -> {
            err.printStackTrace();
            ctx.response().setStatusCode(500).end("Serverfehler");
          }
        }
      });
  }

  //Angebot erfassen
  private void proposeAngebotHandler(RoutingContext ctx) {

    UUID hangaranbieterId = ctx.get("anbieterId");
    int angebotId;

    try {
      angebotId = Integer.parseInt(ctx.pathParam("id"));
    } catch (Exception e) {
      ctx.response().setStatusCode(400).end("Ungültige Angebots-ID");
      return;
    }

    JsonObject body = ctx.body().asJsonObject();
    if (body == null || body.getString("inhalt") == null || body.getString("inhalt").isBlank()) {
      ctx.response().setStatusCode(400).end("Inhalt fehlt");
      return;
    }

    String inhalt = body.getString("inhalt");

  /* ---------------------------------------
     ob das Angebot dem user gehört
     --------------------------------------- */
    String checkSql = """
    SELECT inhalt, accepted
    FROM angebot
    WHERE id = $1
      AND hangaranbieter_id = $2
  """;

    client.preparedQuery(checkSql)
      .execute(Tuple.of(angebotId, hangaranbieterId))
      .compose(rows -> {

        if (!rows.iterator().hasNext()) {
          return Future.failedFuture("ANGEBOT_NOT_FOUND");
        }

        Row row = rows.iterator().next();

        if (row.getString("inhalt") != null) {
          return Future.failedFuture("ANGEBOT_ALREADY_PROPOSED");
        }

        if (row.getBoolean("accepted") != null) {
          return Future.failedFuture("ANGEBOT_ALREADY_DECIDED");
        }

  /* ---------------------------------------
     Update inhalt
     --------------------------------------- */
        String updateSql = """
        UPDATE angebot
        SET inhalt = $1
        WHERE id = $2
      """;

        return client.preparedQuery(updateSql)
          .execute(Tuple.of(inhalt, angebotId));
      })
      .onSuccess(v ->
        ctx.response()
          .setStatusCode(200)
          .putHeader("Content-Type", "application/json")
          .end(new JsonObject()
            .put("message", "Angebot erfolgreich übermittelt")
            .encode())
      )
      .onFailure(err -> {
        switch (err.getMessage()) {
          case "ANGEBOT_NOT_FOUND" ->
            ctx.response().setStatusCode(404).end("Angebot nicht gefunden");
          case "ANGEBOT_ALREADY_PROPOSED" ->
            ctx.response().setStatusCode(409).end("Angebot wurde bereits vorgeschlagen");
          case "ANGEBOT_ALREADY_DECIDED" ->
            ctx.response().setStatusCode(409).end("Angebot wurde bereits entschieden");
          default -> {
            err.printStackTrace();
            ctx.response().setStatusCode(500).end("Serverfehler");
          }
        }
      });
  }

  // erhalten Angebotanfragen
  private void getReceivedAngeboteHandler(RoutingContext ctx) {

    UUID hangaranbieterId = ctx.get("anbieterId");

    String sql = """
    SELECT
      a.id                     AS angebot_id,
      a.accepted,
      a.inhalt,
      a.von,
      a.bis,

      s.id                     AS stellplatz_id,
      s.kennzeichen            AS stellplatz_kennzeichen,
      s.standort               AS stellplatz_standort,

      f.id                     AS flugzeug_id,
      f.kennzeichen            AS flugzeug_kennzeichen,

      fb.id                    AS flugzeugbesitzer_id,
      b.name                   AS flugzeugbesitzer_name,
      b.email                  AS flugzeugbesitzer_email

    FROM angebot a
    JOIN stellplatz s ON s.id = a.stellplatz_id
    JOIN flugzeug f ON f.id = a.flugzeug_id
    JOIN flugzeugbesitzer fb ON fb.id = a.flugzeugbesitzer_id
    JOIN benutzer b ON b.id = fb.benutzer_id
    WHERE a.hangaranbieter_id = $1
    ORDER BY a.von DESC
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(hangaranbieterId))
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response()
          .setStatusCode(500)
          .end("Fehler beim Laden der Angebote");
      })
      .onSuccess(rows -> {

        JsonArray result = new JsonArray();

        rows.forEach(row -> {
          JsonObject angebot = new JsonObject()
            .put("id", row.getInteger("angebot_id"))
            .put("accepted", row.getBoolean("accepted"))
            .put("inhalt", row.getString("inhalt"))

            .put("stellplatz", new JsonObject()
              .put("id", row.getUUID("stellplatz_id").toString())
              .put("kennzeichen", row.getString("stellplatz_kennzeichen"))
              .put("standort", row.getString("stellplatz_standort"))
            )

            .put("flugzeug", new JsonObject()
              .put("id", row.getUUID("flugzeug_id").toString())
              .put("kennzeichen", row.getString("flugzeug_kennzeichen"))
            )

            .put("flugzeugbesitzer", new JsonObject()
              .put("id", row.getUUID("flugzeugbesitzer_id").toString())
              .put("name", row.getString("flugzeugbesitzer_name"))
              .put("email", row.getString("flugzeugbesitzer_email"))
            )

            .put("zeitraum", new JsonObject()
              .put("von", row.getLocalDate("von").toString())
              .put("bis", row.getLocalDate("bis").toString())
            );

          result.add(angebot);
        });

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .setStatusCode(200)
          .end(result.encode());
      });
  }

  //Angebot löschen
  private void deleteAngebotHandler(RoutingContext ctx) {

    UUID hangaranbieterId = ctx.get("anbieterId");

    Integer angebotId;
    try {
      angebotId = Integer.parseInt(ctx.pathParam("id"));
    } catch (NumberFormatException e) {
      ctx.response()
        .setStatusCode(400)
        .end("Ungültige Angebot-ID");
      return;
    }

    String sql = """
    DELETE FROM angebot
    WHERE id = $1
      AND hangaranbieter_id = $2
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(angebotId, hangaranbieterId))
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response()
          .setStatusCode(500)
          .end("Serverfehler");
      })
      .onSuccess(res -> {

        if (res.rowCount() == 0) {
          // soit inexistant, soit pas propriétaire
          ctx.response()
            .setStatusCode(404)
            .end("Angebot nicht gefunden");
          return;
        }

        ctx.response()
          .setStatusCode(200)
          .putHeader("Content-Type", "application/json")
          .end(new JsonObject()
            .put("message", "Angebot erfolgreich gelöscht")
            .encode());
      });
  }

  //Übergabe/Rückgabetermin erfassen
  private void createTerminHandler(RoutingContext ctx) {

    UUID flugzeugbesitzerId = ctx.get("flugzeugbesitzerId");

    JsonObject body = ctx.body().asJsonObject();
    if (body == null) {
      ctx.response().setStatusCode(400).end("Request body fehlt");
      return;
    }

    UUID hangaranbieterId;
    UUID stellplatzId;
    Boolean istUebergabe;
    OffsetDateTime terminZeitpunkt;

    try {
      hangaranbieterId = UUID.fromString(body.getString("hangaranbieter_id"));
      stellplatzId = UUID.fromString(body.getString("stellplatz_id"));
      istUebergabe = body.getBoolean("ist_uebergabe");

      // ISO-8601 → OffsetDateTime (timestamp with time zone)
      terminZeitpunkt = OffsetDateTime.parse(body.getString("termin_zeitpunkt"));
    } catch (Exception e) {
      ctx.response().setStatusCode(400).end("Ungültige Request-Daten");
      return;
    }

    String sql = """
    INSERT INTO uebergabe_rueckgabe_termin
      (flugzeugbesitzer_id, hangaranbieter_id, stellplatz_id, termin_zeitpunkt, ist_uebergabe)
    VALUES ($1, $2, $3, $4, $5)
  """;

    client
      .preparedQuery(sql)
      .execute(Tuple.of(
        flugzeugbesitzerId,
        hangaranbieterId,
        stellplatzId,
        terminZeitpunkt,
        istUebergabe
      ))
      .onSuccess(res -> {
        ctx.response()
          .setStatusCode(201)
          .putHeader("Content-Type", "application/json")
          .end(new JsonObject()
            .put("message", "Termin erfolgreich erstellt")
            .encode());
      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response()
          .setStatusCode(500)
          .end("Fehler beim Speichern des Termins");
      });
  }

  //Meine Termine
  private void terminMeHandler(RoutingContext ctx) {

    UUID benutzerId = UUID.fromString(ctx.user().principal().getString("sub"));
    String rolle = ctx.user().principal().getString("rolle");

    Future<UUID> idFuture;
    String whereClause;

    if ("FLUGZEUGBESITZER".equalsIgnoreCase(rolle)) {
      idFuture = flugzeugbesitzerService.getFlugzeugbesitzerId(benutzerId);
      whereClause = " WHERE t.flugzeugbesitzer_id = $1";
    } else if ("HANGARANBIETER".equalsIgnoreCase(rolle)) {
      idFuture = hangaranbieterService.getHAnbieterId(benutzerId);
      whereClause = " WHERE t.hangaranbieter_id = $1";
    } else {
      ctx.response().setStatusCode(403).end("Unbekannte Rolle");
      return;
    }

    String sql = """
    SELECT DISTINCT ON (t.id)
      t.id AS termin_id,
      t.ist_uebergabe,
      t.termin_zeitpunkt,

      s.id AS stellplatz_id,
      s.kennzeichen AS stellplatz_kennzeichen,
      s.standort,

      f.id AS flugzeug_id,
      f.kennzeichen AS flugzeug_kennzeichen,

      fb.id AS flugzeugbesitzer_id,
      b_fb.name AS flugzeugbesitzer_name,
      b_fb.email AS flugzeugbesitzer_email,

      h.id AS hangaranbieter_id,
      h.firmenname

    FROM uebergabe_rueckgabe_termin t
    JOIN stellplatz s ON s.id = t.stellplatz_id
    JOIN flugzeugbesitzer fb ON fb.id = t.flugzeugbesitzer_id
    JOIN benutzer b_fb ON b_fb.id = fb.benutzer_id
    JOIN hangaranbieter h ON h.id = t.hangaranbieter_id
    JOIN flugzeug f ON f.flugzeugbesitzer_id = fb.id
     %s \n
    ORDER BY t.id, t.termin_zeitpunkt ASC
  """.formatted(whereClause);
    System.out.println(sql);
    System.out.println(benutzerId);
    System.out.println(rolle);
    System.out.println(idFuture.toString());

    idFuture
      .compose(metierId ->
        client.preparedQuery(sql).execute(Tuple.of(metierId))
      )
      .onSuccess(rows -> {

        JsonArray result = new JsonArray();

        for (Row row : rows) {
          JsonObject termin = new JsonObject()
            .put("id", row.getUUID("termin_id").toString())
            .put("is_uebergabe", row.getBoolean("ist_uebergabe"))
            .put("termin_zeitpunkt",
              row.getOffsetDateTime("termin_zeitpunkt").toString()
            )
            .put("stellplatz", new JsonObject()
              .put("id", row.getUUID("stellplatz_id").toString())
              .put("kennzeichen", row.getString("stellplatz_kennzeichen"))
              .put("standort", row.getString("standort"))
            )
            .put("flugzeug", new JsonObject()
              .put("id", row.getUUID("flugzeug_id").toString())
              .put("kennzeichen", row.getString("flugzeug_kennzeichen"))
            )
            .put("flugzeugbesitzer", new JsonObject()
              .put("id", row.getUUID("flugzeugbesitzer_id").toString())
              .put("name", row.getString("flugzeugbesitzer_name"))
              .put("email", row.getString("flugzeugbesitzer_email"))
            )
            .put("hangaranbieter", new JsonObject()
              .put("id", row.getUUID("hangaranbieter_id").toString())
              .put("firmenname", row.getString("firmenname"))
            );

          result.add(termin);
        }

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .end(result.encode());
      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response().setStatusCode(404).end(err.getMessage());
      });
  }

  //Verfügbarkeit eines Stellplatzs aktualisieren
  private void updateStellplatzAvailabilityHandler(RoutingContext ctx) {

    UUID stellplatzId;
    try {
      stellplatzId = UUID.fromString(ctx.pathParam("id"));
    } catch (IllegalArgumentException e) {
      ctx.response().setStatusCode(400).end("ID de Stellplatz invalide");
      return;
    }

    UUID anbieterId = ctx.get("anbieterId");

    JsonObject body = ctx.body().asJsonObject();
    if (body == null || !body.containsKey("availability")) {
      ctx.response().setStatusCode(400).end("Champ 'availability' manquant");
      return;
    }

    Boolean availability = body.getBoolean("availability");

    String sql = """
    UPDATE stellplatz
    SET availability = $1
    WHERE id = $2
      AND hangaranbieter_id = $3
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(availability, stellplatzId, anbieterId))
      .onSuccess(res -> {
        if (res.rowCount() == 0) {
          ctx.response()
            .setStatusCode(404)
            .end("Stellplatz nicht trouvé ou accès refusé");
          return;
        }

        ctx.response()
          .setStatusCode(200)
          .putHeader("Content-Type", "application/json")
          .end(new JsonObject()
            .put("id", stellplatzId.toString())
            .put("availability", availability)
            .encode()
          );
      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response().setStatusCode(500).end("Erreur serveur");
      });
  }

  //Stellplatz löschen
  private void deleteStellplatzHandler(RoutingContext ctx) {

    UUID stellplatzId;
    try {
      stellplatzId = UUID.fromString(ctx.pathParam("id"));
    } catch (IllegalArgumentException e) {
      ctx.response().setStatusCode(400).end("ID Stellplatz invalide");
      return;
    }
    UUID anbieterId = ctx.get("anbieterId");

    // ob der Stellplatz schon abgebucht worden
    String checkSql = """
    SELECT 1
    FROM flugzeug_zu_stellplatz
    WHERE stellplatz_id = $1
      AND bis >= CURRENT_DATE
    LIMIT 1
  """;

    client.preparedQuery(checkSql)
      .execute(Tuple.of(stellplatzId))
      .compose(rows -> {
        if (rows.iterator().hasNext()) {
          return Future.failedFuture("STELLPLATZ_GEBUCHT");
        }

        //  ownership check included
        String deleteSql = """
        DELETE FROM stellplatz
        WHERE id = $1
          AND hangaranbieter_id = $2
      """;

        return client
          .preparedQuery(deleteSql)
          .execute(Tuple.of(stellplatzId, anbieterId));
      })
      .onSuccess(res -> {
        if (res.rowCount() == 0) {
          ctx.response()
            .setStatusCode(404)
            .end("Stellplatz nicht gefunden oder Zugriff verweigert");
          return;
        }

        ctx.response()
          .setStatusCode(200)
          .end("Stellplatz erfolgreich gelöscht");
      })
      .onFailure(err -> {
        if ("STELLPLATZ_GEBUCHT".equals(err.getMessage())) {
          ctx.response()
            .setStatusCode(409)
            .end("Stellplatz ist aktuell oder zukünftig gebucht");
        } else {
          err.printStackTrace();
          ctx.response().setStatusCode(500).end("Serverfehler");
        }
      });
  }

  //Stellplatzinfos abrufen
  private void getStellplatzHandler(RoutingContext ctx) {
    UUID stellplatzId;

    try {
      stellplatzId = UUID.fromString(ctx.pathParam("id"));
    } catch (Exception e) {
      ctx.response().setStatusCode(400).end("Ungültige Stellplatz-ID");
      return;
    }

    String stellplatzSql = """
    SELECT
      id,
      flugzeugtyp,
      flugzeuggroesse,
      standort,
      bild,
      kennzeichen,
      besonderheit,
      availability
    FROM stellplatz
    WHERE id = $1
  """;

    client.preparedQuery(stellplatzSql)
      .execute(Tuple.of(stellplatzId))
      .onFailure(err ->
        ctx.response().setStatusCode(500).end(err.getMessage())
      )
      .onSuccess(rows -> {
        if (!rows.iterator().hasNext()) {
          ctx.response().setStatusCode(404).end("Stellplatz nicht gefunden");
          return;
        }

        Row row = rows.iterator().next();

        JsonObject stellplatzJson = new JsonObject()
          .put("id", row.getUUID("id").toString())
          .put("flugzeugtyp", row.getString("flugzeugtyp"))
          .put("flugzeugsgrösse", row.getString("flugzeuggroesse"))
          .put("standort", row.getString("standort"))
          .put("bild", row.getString("bild"))
          .put("kennzeichen", row.getString("kennzeichen"))
          .put("besonderheit", row.getString("besonderheit"))
          .put("availability", row.getBoolean("availability"));

        fetchServicesForStellplatz(ctx, stellplatzId, stellplatzJson);
      });
  }

  private void fetchServicesForStellplatz(
    RoutingContext ctx,
    UUID stellplatzId,
    JsonObject stellplatzJson
  ) {

    String serviceSql = """
    SELECT
      s.bezeichnung,
      os.preis,
      os.einheit
    FROM service_zu_stellplatz szs
    JOIN service s ON s.id = szs.service_id
    JOIN angebotene_services os ON os.service_id = s.id
    WHERE szs.stellplatz_id = $1
  """;

    client.preparedQuery(serviceSql)
      .execute(Tuple.of(stellplatzId))
      .onFailure(err ->
        ctx.response().setStatusCode(500).end(err.getMessage())
      )
      .onSuccess(rows -> {
        JsonObject services = new JsonObject();

        for (Row r : rows) {
          services.put(
            r.getString("bezeichnung"),
            new JsonObject()
              .put("enabled", true)
              .put("price", r.getBigDecimal("preis"))
              .put("unit", r.getString("einheit"))
          );
        }

        stellplatzJson.put("services", services);

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .end(stellplatzJson.encode());
      });
  }


  private void updateStellplatzHandler(RoutingContext ctx) {

    UUID stellplatzId;
    UUID anbieterId;

    try {
      stellplatzId = UUID.fromString(ctx.pathParam("id"));
      anbieterId = ctx.get("anbieterId");
    } catch (Exception e) {
      ctx.response().setStatusCode(400).end("Ungültige ID");
      return;
    }

    String kennzeichen = ctx.request().getFormAttribute("kennzeichen");
    String standort = ctx.request().getFormAttribute("standort");
    String besonderheit = ctx.request().getFormAttribute("besonderheit");
    String flugzeugtyp = ctx.request().getFormAttribute("flugzeugtyp");
    String flugzeuggroesse = ctx.request().getFormAttribute("flugzeuggroesse");

    // Bild (optional)
    FileUpload upload = ctx.fileUploads().stream().findFirst().orElse(null);
    if (!ctx.fileUploads().isEmpty()) {
      upload = ctx.fileUploads().iterator().next();
      String filename = upload.fileName();
      String target = "uploads/stellplaetze/" + filename;

      try {
        Files.createDirectories(Path.of("uploads/stellplaetze"));
        Files.move(Path.of(upload.uploadedFileName()), Path.of(target));
      } catch (IOException e) {
        ctx.fail(500, e);
        return;
      }
    }

    // ausgewählte Services
    List<String> services =
      ctx.request().formAttributes().getAll("services");

    // Konstruktion SQL
    StringBuilder sql = new StringBuilder("""
    UPDATE stellplatz
    SET
      kennzeichen = $1,
      standort = $2,
      besonderheit = $3,
      flugzeugtyp = $4,
      flugzeuggroesse = $5
  """);

    List<Object> params = new ArrayList<>(List.of(
      kennzeichen,
      standort,
      besonderheit,
      flugzeugtyp,
      flugzeuggroesse
    ));

    // bild vorhanden → update
    if (upload != null) {
      sql.append(", bild = $6 ");
      params.add("/uploads/stellplaetze/" + upload.fileName());
    }

    sql.append(" WHERE id = $")
      .append(params.size() + 1)
      .append(" AND hangaranbieter_id = $")
      .append(params.size() + 2);

    params.add(stellplatzId);
    params.add(anbieterId);

    client.preparedQuery(sql.toString())
      .execute(Tuple.tuple(params))
      .compose(v -> deleteServicesForStellplatz(stellplatzId))
      .compose(v -> insertServicesForStellplatz(stellplatzId, services))
      .onSuccess(v ->
        ctx.response()
          .setStatusCode(200)
          .end("Stellplatz aktualisiert")
      )
      .onFailure(err ->
        ctx.response()
          .setStatusCode(500)
          .end(err.getMessage())
      );
  }

  private Future<Void> deleteServicesForStellplatz(UUID stellplatzId) {

    String sql = """
    DELETE FROM service_zu_stellplatz
    WHERE stellplatz_id = $1
  """;

    return client.preparedQuery(sql)
      .execute(Tuple.of(stellplatzId))
      .mapEmpty();
  }

  private void getHangaranbieterDashboard(RoutingContext ctx) {

    UUID anbieterId = ctx.get("anbieterId");

    String sql = """
WITH
stellplaetze_stats AS (
  SELECT
    hangaranbieter_id,
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE availability = true) AS frei,
    COUNT(*) FILTER (WHERE availability = false) AS belegt
  FROM stellplatz
  GROUP BY hangaranbieter_id
),

reservierungen_stats AS (
  SELECT
    s.hangaranbieter_id,
    COUNT(*) AS anzahl
  FROM flugzeug_zu_stellplatz fzs
  JOIN stellplatz s ON s.id = fzs.stellplatz_id
  WHERE fzs.bis > current_date
  GROUP BY s.hangaranbieter_id
),

anfragen_stats AS (
  SELECT
    hangaranbieter_id,
    COUNT(*) AS anzahl
  FROM angebot
  WHERE inhalt IS NULL
  GROUP BY hangaranbieter_id
),

termine_stats AS (
  SELECT
    hangaranbieter_id,
    COUNT(*) AS anzahl
  FROM uebergabe_rueckgabe_termin
  WHERE termin_zeitpunkt >= now()
  GROUP BY hangaranbieter_id
)

SELECT
  h.id,
  h.benutzer_id,
  h.firmenname,
  h.ansprechpartner,
  h.telefon,
  h.hangar_merkmale,

  b.email,
  b.strasse,
  b.hausnummer,
  b.plz,
  b.ort,

  COALESCE(sp.total, 0) AS stellplaetze_total,
  COALESCE(sp.frei, 0) AS stellplaetze_frei,
  COALESCE(sp.belegt, 0) AS stellplaetze_belegt,

  COALESCE(r.anzahl, 0) AS reservierungen_anzahl,
  COALESCE(a.anzahl, 0) AS anfragen_anzahl,
  COALESCE(t.anzahl, 0) AS termine_anzahl

FROM hangaranbieter h
JOIN benutzer b ON b.id = h.benutzer_id

LEFT JOIN stellplaetze_stats sp ON sp.hangaranbieter_id = h.id
LEFT JOIN reservierungen_stats r ON r.hangaranbieter_id = h.id
LEFT JOIN anfragen_stats a ON a.hangaranbieter_id = h.id
LEFT JOIN termine_stats t ON t.hangaranbieter_id = h.id

WHERE h.id = $1;
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(anbieterId))
      .onFailure(err ->
        ctx.response().setStatusCode(500).end(err.getMessage())
      )
      .onSuccess(rows -> {

        if (!rows.iterator().hasNext()) {
          ctx.response().setStatusCode(404).end("Hangaranbieter nicht gefunden");
          return;
        }

        Row row = rows.iterator().next();

        Object merkmaleObj = row.getValue("hangar_merkmale");
        JsonObject merkmale = (merkmaleObj instanceof JsonObject)
          ? (JsonObject) merkmaleObj
          : new JsonObject(merkmaleObj.toString());

        JsonObject response = new JsonObject()
          .put("general", new JsonObject()
            .put("id", row.getUUID("id").toString())
            .put("benutzer_id", row.getUUID("benutzer_id").toString())
            .put("firmenname", row.getString("firmenname"))
            .put("email", row.getString("email"))
            .put("tel", row.getString("telefon"))
            .put("strasse", row.getString("strasse"))
            .put("hausnummer", row.getString("hausnummer"))
            .put("plz", row.getString("plz"))
            .put("ort", row.getString("ort"))
            .put("ansprechpartner", row.getString("ansprechpartner"))
            .put("hangar_merkmale", merkmale)
          )
          .put("stellplaetze", new JsonObject()
            .put("total", row.getLong("stellplaetze_total"))
            .put("frei", row.getLong("stellplaetze_frei"))
            .put("belegt", row.getLong("stellplaetze_belegt"))
          )
          .put("reservierungen", new JsonObject()
            .put("anzahl", row.getLong("reservierungen_anzahl"))
          )
          .put("termine", new JsonObject()
            .put("anzahl", row.getLong("termine_anzahl"))
          )
          .put("anfragen", new JsonObject()
            .put("anzahl", row.getLong("anfragen_anzahl"))
          );

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .end(response.encode());
      });
  }

  //Detailsinfos anfordern
  private void createDetailsinfosAnfrageHandler(RoutingContext ctx) {

    UUID flugzeugbesitzerId = ctx.get("flugzeugbesitzerId");

    JsonObject body = ctx.body().asJsonObject();
    if (body == null) {
      ctx.response().setStatusCode(400).end("Request body fehlt");
      return;
    }

    UUID stellplatzId;
    UUID hangaranbieterId;

    try {
      stellplatzId = UUID.fromString(body.getString("stellplatzId"));
      hangaranbieterId = UUID.fromString(body.getString("hangaranbieterId"));
    } catch (Exception e) {
      ctx.response().setStatusCode(400).end("Ungültige UUID");
      return;
    }

    // Check ob die gleiche Anfrage schon vorhanden ist
    String checkSql = """
    SELECT 1
    FROM anfrage
    WHERE flugzeugbesitzer_id = $1
      AND hangaranbieter_id = $2
      AND stellplatz_id = $3
      AND is_detailsinfos = true
  """;

    client.preparedQuery(checkSql)
      .execute(Tuple.of(
        flugzeugbesitzerId,
        hangaranbieterId,
        stellplatzId
      ))
      .compose(rows -> {

        // Anfrage schon vorhanden
        if (rows.iterator().hasNext()) {
          return Future.succeededFuture();
        }

        // INSERTION
        String insertSql = """
        INSERT INTO anfrage (
          flugzeugbesitzer_id,
          hangaranbieter_id,
          stellplatz_id,
          is_detailsinfos
        )
        VALUES ($1, $2, $3, true)
      """;

        return client.preparedQuery(insertSql)
          .execute(Tuple.of(
            flugzeugbesitzerId,
            hangaranbieterId,
            stellplatzId
          ))
          .mapEmpty();
      })
      .onSuccess(v -> {
        ctx.response()
          .setStatusCode(200)
          .putHeader("Content-Type", "application/json")
          .end(new JsonObject()
            .put("message", "Detailinfos-Anfrage erfolgreich übermittelt")
            .encode()
          );
      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response().setStatusCode(500).end("Serverfehler");
      });
  }

  //Anfrage stellen
  private void createAnfrageHandler(RoutingContext ctx) {

    UUID flugzeugbesitzerId = ctx.get("flugzeugbesitzerId");
    JsonObject body = ctx.body().asJsonObject();

    if (body == null) {
      ctx.response().setStatusCode(400).end("Request body fehlt");
      return;
    }

    UUID hangaranbieterId;
    UUID stellplatzId;
    UUID flugzeugId;
    String betreff;
    String inhalt;

    try {
      hangaranbieterId = UUID.fromString(body.getString("hangaranbieter_id"));
      stellplatzId = UUID.fromString(body.getString("stellplatz_id"));
      flugzeugId = UUID.fromString(body.getString("flugzeug_id"));
      betreff = body.getString("betreff");
      inhalt = body.getString("inhalt");
    } catch (Exception e) {
      ctx.response().setStatusCode(400).end("Ungültige Parameter");
      return;
    }

    if (betreff == null || betreff.isBlank() || inhalt == null || inhalt.isBlank()) {
      ctx.response().setStatusCode(400).end("Betreff und Inhalt sind erforderlich");
      return;
    }

    // Spam-Check
    String checkSql = """
    SELECT 1
    FROM anfrage
    WHERE flugzeugbesitzer_id = $1
      AND hangaranbieter_id = $2
      AND stellplatz_id = $3
      AND flugzeug_id = $4
      AND betreff = $5
      AND inhalt = $6
      AND is_detailsinfos = false
    LIMIT 1
  """;

    client.preparedQuery(checkSql)
      .execute(Tuple.of(
        flugzeugbesitzerId,
        hangaranbieterId,
        stellplatzId,
        flugzeugId,
        betreff,
        inhalt
      ))
      .compose(rows -> {

        // Anfrage existiert bereits → kein Insert, aber OK
        if (rows.iterator().hasNext()) {
          return Future.succeededFuture();
        }

        // Insert
        String insertSql = """
        INSERT INTO anfrage (
          flugzeugbesitzer_id,
          hangaranbieter_id,
          stellplatz_id,
          flugzeug_id,
          betreff,
          inhalt,
          is_detailsinfos
        )
        VALUES ($1, $2, $3, $4, $5, $6, false)
      """;

        return client.preparedQuery(insertSql)
          .execute(Tuple.of(
            flugzeugbesitzerId,
            hangaranbieterId,
            stellplatzId,
            flugzeugId,
            betreff,
            inhalt
          ));
      })
      .onSuccess(res -> {
        ctx.response()
          .setStatusCode(200)
          .putHeader("Content-Type", "application/json")
          .end(new JsonObject()
            .put("message", "Anfrage erfolgreich gesendet")
            .encode()
          );
      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response().setStatusCode(500).end("Serverfehler");
      });
  }

  //GET ANfragen
  private void getAnfragenForHangaranbieter(RoutingContext ctx) {

    UUID anbieterId = ctx.get("anbieterId");

    if (anbieterId == null) {
      ctx.response().setStatusCode(401).end("Unauthorized");
      return;
    }

    String sql = """
    SELECT
      a.id AS anfrage_id,
      a.is_detailsinfos,
      a.answered,
      a.betreff,
      a.inhalt,

      s.id AS stellplatz_id,
      s.kennzeichen AS stellplatz_kennzeichen,
      s.standort AS stellplatz_standort,

      ha.id AS hangaranbieter_id,
      ha.firmenname,

      fb.id AS flugzeugbesitzer_id,
      b.name AS flugzeugbesitzer_name,
      b.email AS flugzeugbesitzer_email,

      f.id AS flugzeug_id,
      f.kennzeichen AS flugzeug_kennzeichen

    FROM anfrage a
    JOIN stellplatz s ON s.id = a.stellplatz_id
    JOIN hangaranbieter ha ON ha.id = a.hangaranbieter_id
    JOIN flugzeugbesitzer fb ON fb.id = a.flugzeugbesitzer_id
    JOIN benutzer b ON b.id = fb.benutzer_id
    LEFT JOIN flugzeug f ON f.id = a.flugzeug_id

    WHERE a.hangaranbieter_id = $1
    ORDER BY a.created_at DESC
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(anbieterId))
      .onSuccess(rows -> {

        JsonArray result = new JsonArray();

        for (Row row : rows) {
          JsonObject anfrage = new JsonObject()
            .put("id", row.getInteger("anfrage_id"))
            .put("is_detailsinfos", row.getBoolean("is_detailsinfos"))
            .put("answered", row.getBoolean("answered"))
            .put("betreff", row.getString("betreff"))
            .put("inhalt", row.getString("inhalt"))

            .put("stellplatz", new JsonObject()
              .put("id", row.getUUID("stellplatz_id"))
              .put("kennzeichen", row.getString("stellplatz_kennzeichen"))
              .put("standort", row.getString("stellplatz_standort"))
            )

            .put("hangaranbieter", new JsonObject()
              .put("id", row.getUUID("hangaranbieter_id"))
              .put("firmenname", row.getString("firmenname"))
            )

            .put("flugzeugbesitzer", new JsonObject()
              .put("id", row.getUUID("flugzeugbesitzer_id"))
              .put("name", row.getString("flugzeugbesitzer_name"))
              .put("email", row.getString("flugzeugbesitzer_email"))
            )

            .put("flugzeug", row.getUUID("flugzeug_id") == null
              ? null
              : new JsonObject()
              .put("id", row.getUUID("flugzeug_id"))
              .put("kennzeichen", row.getString("flugzeug_kennzeichen"))
            );

          result.add(anfrage);
        }

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .end(result.encode());

      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response()
          .setStatusCode(500)
          .end("Fehler beim Laden der Anfragen");
      });
  }

// Anfrage Löschen
  private void deleteAnfrageHandler(RoutingContext ctx) {

    Integer anfrageId;
    try {
      anfrageId = Integer.parseInt(ctx.pathParam("id"));
    } catch (Exception e) {
      ctx.response()
        .setStatusCode(400)
        .end("Ungültige Anfrage-ID");
      return;
    }

    String sql = """
    DELETE FROM anfrage
    WHERE id = $1
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(anfrageId))
      .onSuccess(res -> {
        if (res.rowCount() == 0) {
          ctx.response()
            .setStatusCode(404)
            .end("Anfrage nicht gefunden");
        } else {
          ctx.response()
            .setStatusCode(204) // No Content
            .end();
        }
      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response()
          .setStatusCode(500)
          .end("Serverfehler");
      });
  }

  //Detaisinfos senden
  private void sendDetailsinfosHandler(RoutingContext ctx) {

    Integer anfrageId;
    try {
      anfrageId = Integer.parseInt(ctx.pathParam("id"));
    } catch (Exception e) {
      ctx.response().setStatusCode(400).end("Ungültige Anfrage-ID");
      return;
    }

    JsonObject body = ctx.body().asJsonObject();
    String inhalt = body.getString("inhalt");
    String hangaranbieterId = body.getString("hangaranbieter_id");
    String flugzeugbesitzerId = body.getString("flugzeugbesitzer_id");
    String stellplatzId = body.getString("stellplatz_id");

    if (inhalt == null || inhalt.isBlank()) {
      ctx.response().setStatusCode(400).end("Inhalt fehlt");
      return;
    }

    String insertNachrichtSql = """
    INSERT INTO nachricht (
      hangaranbieter_id,
      flugzeugbesitzer_id,
      stellplatz_id,
      inhalt,
      is_detailsinfos
    )
    VALUES ($1, $2, $3, $4, true)
  """;

    String updateAnfrageSql = """
    UPDATE anfrage
    SET answered = true
    WHERE id = $1
  """;



    client.preparedQuery(insertNachrichtSql)
      .execute(Tuple.of(
        UUID.fromString(hangaranbieterId),
        UUID.fromString(flugzeugbesitzerId),
        UUID.fromString(stellplatzId),
        inhalt
      ))
      .compose(v ->
        client.preparedQuery(updateAnfrageSql)
          .execute(Tuple.of(anfrageId))
      )
      .onSuccess(v -> {
        ctx.response().setStatusCode(201).end();
      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response().setStatusCode(500).end("Serverfehler");
      });

  }

  // ANfrage-status aktualisieren
  private void markAnfrageAnsweredHandler(RoutingContext ctx) {

    Integer anfrageId;
    try {
      anfrageId = Integer.parseInt(ctx.pathParam("id"));
    } catch (Exception e) {
      ctx.response().setStatusCode(400).end("Ungültige Anfrage-ID");
      return;
    }

    String sql = """
    UPDATE anfrage
    SET answered = true
    WHERE id = $1
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(anfrageId))
      .onSuccess(res -> {
        if (res.rowCount() == 0) {
          ctx.response().setStatusCode(404).end("Anfrage nicht gefunden");
        } else {
          ctx.response().setStatusCode(204).end();
        }
      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response().setStatusCode(500).end("Serverfehler");
      });
  }

  //Nachrichten laden
  private void getNachrichtenForFlugzeugbesitzer(RoutingContext ctx) {

    UUID flugzeugbesitzerId = ctx.get("flugzeugbesitzerId");

    String sql = """
    SELECT
      n.id,
      n.inhalt,
      n.is_detailsinfos,
      n.created_at,

      -- Stellplatz
      s.id AS stellplatz_id,
      s.kennzeichen AS stellplatz_kennzeichen,
      s.standort AS stellplatz_standort,

      -- Hangaranbieter
      h.id AS hangar_id,
      h.firmenname AS hangar_firmenname,

      -- Flugzeugbesitzer Benutzer
      fb.id AS fb_id,
      b.name AS fb_name,
      b.email AS fb_email

    FROM nachricht n
    JOIN hangaranbieter h ON n.hangaranbieter_id = h.id
    JOIN flugzeugbesitzer fb ON n.flugzeugbesitzer_id = fb.id
    JOIN benutzer b ON fb.benutzer_id = b.id
    LEFT JOIN stellplatz s ON n.stellplatz_id = s.id

    WHERE n.flugzeugbesitzer_id = $1
    ORDER BY n.created_at DESC
  """;

    client.preparedQuery(sql)
      .execute(Tuple.of(flugzeugbesitzerId))
      .onSuccess(rows -> {
        JsonArray result = new JsonArray();

        for (Row row : rows) {
          JsonObject stellplatz = null;
          if (row.getUUID("stellplatz_id") != null) {
            stellplatz = new JsonObject()
              .put("id", row.getUUID("stellplatz_id").toString())
              .put("kennzeichen", row.getString("stellplatz_kennzeichen"))
              .put("standort", row.getString("stellplatz_standort"));
          }

          JsonObject nachricht = new JsonObject()
            .put("id", row.getInteger("id"))
            .put("inhalt", row.getString("inhalt"))
            .put("is_detailsinfos", row.getBoolean("is_detailsinfos"))
            .put("date", row.getOffsetDateTime("created_at").toString())
            .put("stellplatz", stellplatz)
            .put("hangaranbieter", new JsonObject()
              .put("id", row.getUUID("hangar_id").toString())
              .put("firmenname", row.getString("hangar_firmenname"))
            )
            .put("flugzeugbesitzer", new JsonObject()
              .put("id", row.getUUID("fb_id").toString())
              .put("name", row.getString("fb_name"))
              .put("email", row.getString("fb_email"))
            );

          result.add(nachricht);
        }

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .end(result.encode());
      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response().setStatusCode(500).end("Serverfehler");
      });
  }

  private void deleteNachrichtHandler(RoutingContext ctx){
    String idParam = ctx.pathParam("id");

    if (idParam == null) {
      ctx.response().setStatusCode(400).end("Missing id");
      return;
    }

    int nachrichtId;
    try {
      nachrichtId = Integer.parseInt(idParam);
    } catch (IllegalArgumentException e) {
      ctx.response().setStatusCode(400).end("Invalid UUID");
      return;
    }

    String sql = "DELETE FROM nachricht WHERE id = $1";

    client.preparedQuery(sql)
      .execute(Tuple.of(nachrichtId))
      .onSuccess(res -> {
        ctx.response()
          .setStatusCode(204) // No Content
          .end();
      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response()
          .setStatusCode(500)
          .end("DB error");
      });
  }


  private void getFBesitzerInfosHandler(RoutingContext ctx){
    UUID flugzeugbesitzerId = ctx.get("flugzeugbesitzerId");

    String sql = """
      SELECT
        fb.id,
        fb.benutzer_id,
        b.name,
        b.email,
        fb.telefon AS tel,
        b.strasse,
        b.hausnummer,
        b.plz,
        b.ort
      FROM flugzeugbesitzer fb
      JOIN benutzer b ON fb.benutzer_id = b.id
      WHERE fb.id = $1
    """;

    client.preparedQuery(sql)
      .execute(Tuple.of(flugzeugbesitzerId))
      .onSuccess(rows -> {

        if (!rows.iterator().hasNext()) {
          ctx.response().setStatusCode(404).end();
          return;
        }

        Row row = rows.iterator().next();

        JsonObject json = new JsonObject()
          .put("id", row.getUUID("id").toString())
          .put("benutzer_id", row.getUUID("benutzer_id").toString())
          .put("name", row.getString("name"))
          .put("email", row.getString("email"))
          .put("tel", row.getString("tel"))
          .put("strasse", row.getString("strasse"))
          .put("hausnummer", row.getString("hausnummer"))
          .put("plz", row.getString("plz"))
          .put("ort", row.getString("ort"));

        ctx.response()
          .putHeader("Content-Type", "application/json")
          .end(json.encode());

      })
      .onFailure(err -> {
        err.printStackTrace();
        ctx.response().setStatusCode(500).end();
      });
  }



}
