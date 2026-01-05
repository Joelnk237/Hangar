package hangarByThm.TeamC.HangarByTHM;

import io.vertx.core.json.JsonObject;

import java.util.UUID;

public class Benutzer {
  protected UUID id;
  protected String name;
  protected String email;
  protected String passwortHash;
  protected String rolle;

  public JsonObject toJsonBase() {
    return new JsonObject()
      .put("id", id != null ? id.toString() : null)
      .put("name", name)
      .put("email", email)
      .put("rolle", rolle);
  }

  // getters / setters
  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public String getName() { return name; }
  public String getEmail() { return email; }
  public String getPasswortHash() { return passwortHash; }
  public String getRolle() { return rolle; }
}
