package hangarByThm.TeamC.HangarByTHM;

import io.vertx.core.json.JsonObject;

public class Flugzeugbesitzer extends Benutzer{
  private String telefon;

  public static Flugzeugbesitzer fromJson(JsonObject json) {
    Flugzeugbesitzer f = new Flugzeugbesitzer();
    f.name = json.getString("name");
    f.email = json.getString("email");
    f.passwortHash = json.getString("passwordHash");
    f.rolle = "flugzeugbesitzer";
    f.telefon = json.getString("tel");
    return f;
  }

  public JsonObject toJson() {
    return toJsonBase()
      .put("telefon", telefon);
  }

  public String getTelefon() {
    return telefon;
  }
}
