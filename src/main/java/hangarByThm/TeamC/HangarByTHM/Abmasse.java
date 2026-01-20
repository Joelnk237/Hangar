package hangarByThm.TeamC.HangarByTHM;

import io.vertx.core.json.JsonObject;

public record Abmasse(double fluegelspannweite, double laenge, double hoehe) {
  public JsonObject toJSON() {
    return new JsonObject()
      .put("fluegelspannweite", fluegelspannweite)
      .put("laenge", laenge)
      .put("hoehe", hoehe);
  }
}
