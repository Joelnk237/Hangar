package hangarByThm.TeamC.HangarByTHM;

import io.vertx.core.json.JsonObject;
import java.util.UUID;
import io.vertx.sqlclient.Row;

public class Flugzeug {

  private UUID id;
  private UUID flugzeugbesitzerId;
  private Flugzeugtyp flugzeugtyp;
  private Flugzeuggroesse flugzeuggroesse;
  private String kennzeichen;
  private String bild;
  private Abmasse abmasse;

  private Integer flugstunden;
  private Integer flugkilometer;
  private Double treibstoffverbrauch;
  private Integer frachtkapazitaet;
  private Integer baujahr;
  private boolean status;

  /* ===================== GETTERS / SETTERS ===================== */

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public UUID getFlugzeugbesitzerId() {
    return flugzeugbesitzerId;
  }

  public void setFlugzeugbesitzerId(UUID flugzeugbesitzerId) {
    this.flugzeugbesitzerId = flugzeugbesitzerId;
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

  public String getKennzeichen() {
    return kennzeichen;
  }

  public void setKennzeichen(String kennzeichen) {
    this.kennzeichen = kennzeichen;
  }

  public String getBild() {
    return bild;
  }

  public void setBild(String bild) {
    this.bild = bild;
  }
  public boolean getStatus() {
    return status;
  }

  public void setStatus(boolean status) {
    this.status = status;
  }

  public Integer getFlugstunden() {
    return flugstunden;
  }

  public void setFlugstunden(Integer flugstunden) {
    this.flugstunden = flugstunden;
  }

  public Integer getFlugkilometer() {
    return flugkilometer;
  }

  public void setFlugkilometer(Integer flugkilometer) {
    this.flugkilometer = flugkilometer;
  }

  public Double getTreibstoffverbrauch() {
    return treibstoffverbrauch;
  }

  public void setTreibstoffverbrauch(Double treibstoffverbrauch) {
    this.treibstoffverbrauch = treibstoffverbrauch;
  }

  public Integer getFrachtkapazitaet() {
    return frachtkapazitaet;
  }

  public void setFrachtkapazitaet(Integer frachtkapazitaet) {
    this.frachtkapazitaet = frachtkapazitaet;
  }
  public Abmasse getAbmasse() {
    return abmasse;
  }
  public void setAbmasse(Abmasse abmasse) {
    this.abmasse = abmasse;
  }
  public Integer getBaujahr() {
    return baujahr;
  }

  public void setBaujahr(Integer baujahr) {
    this.baujahr = baujahr;
  }
  /* ===================== JSON ===================== */

  public JsonObject toJson() {
    return new JsonObject()
      .put("id", id != null ? id.toString() : null)
      .put("flugzeugbesitzerId", flugzeugbesitzerId != null ? flugzeugbesitzerId.toString() : null)
      .put("flugzeugtyp", flugzeugtyp != null ? flugzeugtyp.name() : null)
      .put("flugzeuggroesse", flugzeuggroesse != null ? flugzeuggroesse.name() : null)
      .put("kennzeichen", kennzeichen)
      .put("baujahr", baujahr)
      .put("bild", bild)
      .put("status", status)
      .put("flugstunden", flugstunden)
      .put("flugkilometer", flugkilometer)
      .put("treibstoffverbrauch", treibstoffverbrauch)
      .put("frachtkapazitaet", frachtkapazitaet)
      .put("abmasse", abmasse != null ? abmasse.toJSON() : null);

  }

  public static Flugzeug fromJson(JsonObject json) {
    Flugzeug f = new Flugzeug();

    if (json.getString("id") != null)
      f.setId(UUID.fromString(json.getString("id")));
    System.out.println(json.getString("flugzeugbesitzerId"));
    if (json.getString("flugzeugbesitzerId") != null)
      f.setFlugzeugbesitzerId(UUID.fromString(json.getString("flugzeugbesitzerId")));

    if (json.getString("flugzeugtyp") != null)
      f.setFlugzeugtyp(Flugzeugtyp.valueOf(json.getString("flugzeugtyp")));

    if (json.getString("flugzeuggroesse") != null)
      f.setFlugzeuggroesse(Flugzeuggroesse.valueOf(json.getString("flugzeuggroesse")));

    f.setKennzeichen(json.getString("kennzeichen"));
    f.setBild(json.getString("bild"));
    f.setFlugstunden(Integer.parseInt(json.getString("flugstunden")));
    f.setFlugkilometer(Integer.parseInt(json.getString("flugkilometer")));
    f.setTreibstoffverbrauch(Double.parseDouble(json.getString("treibstoffverbrauch")));
    f.setFrachtkapazitaet(Integer.parseInt(json.getString("frachtkapazitaet")));

    return f;
  }


  public Flugzeug(UUID flugzeugbesitzerId, String kennzeichen, UUID id) {
    this.flugzeugbesitzerId = flugzeugbesitzerId;
    this.kennzeichen = kennzeichen;
    this.id = id;
  }
  public Flugzeug() {}

  public static Flugzeug fromRow(Row row) {
    Flugzeug f = new Flugzeug();

    // UUIDs
    UUID id = row.getUUID("id");
    if (id != null) {
      f.setId(id);
    }

    UUID besitzerId = row.getUUID("flugzeugbesitzer_id");
    if (besitzerId != null) {
      f.setFlugzeugbesitzerId(besitzerId);
    }

    // Boolean
    Boolean belegt = row.getBoolean("belegt");
    if (belegt != null) {
      f.setStatus(belegt);
    }

    // Enums (PostgreSQL enum → String → Java enum)
    String typ = row.getString("flugzeugtyp");
    if (typ != null) {
      f.setFlugzeugtyp(Flugzeugtyp.valueOf(typ));
    }

    String groesse = row.getString("flugzeuggroesse");
    if (groesse != null) {
      f.setFlugzeuggroesse(Flugzeuggroesse.valueOf(groesse));
    }

    // Strings
    f.setKennzeichen(row.getString("kennzeichen"));
    f.setBild(row.getString("bild"));

    // Numeriques
    f.setFlugkilometer(row.getInteger("flugkilometer"));
    f.setFlugstunden(row.getInteger("flugstunden"));
    f.setBaujahr(row.getInteger("baujahr"));
    f.setTreibstoffverbrauch(
      row.getBigDecimal("treibstoffverbrauch") != null
        ? row.getBigDecimal("treibstoffverbrauch").doubleValue()
        : null
    );
    f.setFrachtkapazitaet(row.getInteger("frachtkapazitaet"));

    // JSONB → Abmasse
    JsonObject abmasseJson = row.getJsonObject("abmasse");
    if (abmasseJson != null) {
      Abmasse abmasse = new Abmasse(
        Double.parseDouble(abmasseJson.getString("fluegelspannweite")),
        Double.parseDouble(abmasseJson.getString("laenge")),
        Double.parseDouble(abmasseJson.getString("hoehe"))
      );
      f.setAbmasse(abmasse);
    }

    return f;
  }
}

