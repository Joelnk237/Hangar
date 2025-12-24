package hangarByThm.TeamC.HangarByTHM;

import io.vertx.core.Future;
import io.vertx.core.VerticleBase;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpMethod;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CorsHandler;


public class MainVerticle extends VerticleBase {

  // The following snippet is only necessary if you want to start the server directly using IntelliJ
  public static void main(String[] args) {
    Vertx.vertx().deployVerticle(new MainVerticle());
  }


  @Override
  public Future<?> start() {

    Router router = Router.router(vertx);

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
}
