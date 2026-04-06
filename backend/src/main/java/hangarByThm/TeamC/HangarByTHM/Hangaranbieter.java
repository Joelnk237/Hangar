package hangarByThm.TeamC.HangarByTHM;

import io.vertx.core.json.JsonObject;

public class Hangaranbieter extends Benutzer{
  private String firmenname;
  private String ansprechpartner;
  private String telefon;

  private JsonObject hangarMerkmale;
  private JsonObject services;
  private JsonObject flugzeugtypUndStellplaetze;

  public static Hangaranbieter fromJson(JsonObject json) {
    Hangaranbieter h = new Hangaranbieter();
    h.name = json.getString("firmenname");
    h.email = json.getString("email");
    h.passwortHash = json.getString("passwordHash");
    h.rolle = "hangaranbieter";

    h.firmenname = json.getString("firmenname");
    h.ansprechpartner = json.getString("ansPartner");
    h.telefon = json.getString("tel");

    h.hangarMerkmale = json.getJsonObject("hangarMerkmale");
    h.services = json.getJsonObject("services");
    h.flugzeugtypUndStellplaetze = json.getJsonObject("flugzeugtypUndStellplaetze");

    return h;
  }

  public JsonObject toJson() {
    return toJsonBase()
      .put("firmenname", firmenname)
      .put("ansprechpartner", ansprechpartner)
      .put("telefon", telefon)
      .put("hangarMerkmale", hangarMerkmale)
      .put("services", services)
      .put("flugzeugtypUndStellplaetze", flugzeugtypUndStellplaetze);
  }
}
