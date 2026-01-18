package hangarByThm.TeamC.HangarByTHM;

import io.vertx.core.json.JsonObject;
import java.util.UUID;
import io.vertx.sqlclient.Row;

public class Stellplatz {

  private UUID id;
  private String kennzeichen;
  private UUID hangaranbieterId;
  private Flugzeugtyp flugzeugtyp;
  private Flugzeuggroesse flugzeuggroesse;
  private String standort;
  private String besonderheit;
  private String bild;
  private Boolean availability;

  /* ===================== GETTERS / SETTERS ===================== */

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getKennzeichen() {
    return kennzeichen;
  }

  public void setKennzeichen(String kennzeichen) {
    this.kennzeichen = kennzeichen;
  }

  public UUID getHangaranbieterId() {
    return hangaranbieterId;
  }

  public void setHangaranbieterId(UUID hangaranbieterId) {
    this.hangaranbieterId = hangaranbieterId;
  }

  public Flugzeugtyp getFlugzeugtyp() {
    return flugzeugtyp;
  }

  public void setFlugzeugtyp(Flugzeugtyp flugzeugtyp) {
    this.flugzeugtyp = flugzeugtyp;
  }

  public Flugzeuggroesse getFlugzeuggroesse() {
    return flugzeuggroesse;
  }

  public void setFlugzeuggroesse(Flugzeuggroesse flugzeuggroesse) {
    this.flugzeuggroesse = flugzeuggroesse;
  }

  public String getStandort() {
    return standort;
  }

  public void setStandort(String standort) {
    this.standort = standort;
  }
  public String getBild() {
    return bild;
  }

  public void setBild(String bild) {
    this.bild = bild;
  }

  public String getBesonderheit() {
    return besonderheit;
  }

  public void setBesonderheit(String besonderheit) {
    this.besonderheit = besonderheit;
  }

  public Boolean getAvailability() {
    return availability;
  }

  public void setAvailability(Boolean availability) {
    this.availability = availability;
  }

  /* ===================== JSON ===================== */

  public JsonObject toJson() {
    return new JsonObject()
      .put("id", id != null ? id.toString() : null)
      .put("kennzeichen", kennzeichen)
      .put("hangaranbieterId", hangaranbieterId != null ? hangaranbieterId.toString() : null)
      .put("flugzeugtyp", flugzeugtyp != null ? flugzeugtyp.name() : null)
      .put("flugzeuggroesse", flugzeuggroesse != null ? flugzeuggroesse.name() : null)
      .put("standort", standort)
      .put("besonderheit", besonderheit)
      .put("bild", bild != null ? bild : null)
      .put("availability", availability);

  }

  public static Stellplatz fromJson(JsonObject json) {
    Stellplatz s = new Stellplatz();

    if (json.getString("id") != null)
      s.setId(UUID.fromString(json.getString("id")));

    if (json.getString("hangaranbieterId") != null)
      s.setHangaranbieterId(UUID.fromString(json.getString("hangaranbieterId")));

    if (json.getString("flugzeugtyp") != null)
      s.setFlugzeugtyp(Flugzeugtyp.valueOf(json.getString("flugzeugtyp")));

    if (json.getString("flugzeuggroesse") != null)
      s.setFlugzeuggroesse(Flugzeuggroesse.valueOf(json.getString("flugzeuggroesse")));

    s.setKennzeichen(json.getString("kennzeichen"));
    s.setBild(json.getString("bild"));
    s.setStandort(json.getString("standort"));
    s.setBesonderheit(json.getString("besonderheit"));
    s.setAvailability(json.getBoolean("availability", true));

    return s;
  }

  public static Stellplatz fromRow(Row row) {
    Stellplatz s = new Stellplatz();

    s.setId(row.getUUID("id"));
    s.setHangaranbieterId(row.getUUID("hangaranbieter_id"));
    s.setKennzeichen(row.getString("kennzeichen"));
    s.setStandort(row.getString("standort"));
    s.setBesonderheit(row.getString("besonderheit"));
    s.setAvailability(row.getBoolean("availability"));

    // Enums PostgreSQL -> Java enums
    String flugzeugtypStr = row.getString("flugzeugtyp");
    if (flugzeugtypStr != null) {
      s.setFlugzeugtyp(Flugzeugtyp.valueOf(flugzeugtypStr));
    }

    String flugzeuggroesseStr = row.getString("flugzeuggroesse");
    if (flugzeuggroesseStr != null) {
      s.setFlugzeuggroesse(Flugzeuggroesse.valueOf(flugzeuggroesseStr));
    }

    return s;
  }


}

