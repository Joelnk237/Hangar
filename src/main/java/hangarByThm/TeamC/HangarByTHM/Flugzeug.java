package hangarByThm.TeamC.HangarByTHM;

import io.vertx.core.json.JsonObject;
import java.util.UUID;

public class Flugzeug {

  private UUID id;
  private UUID flugzeugbesitzerId;
  private Flugzeugtyp flugzeugtyp;
  private Flugzeuggroesse flugzeuggroesse;
  private String kennzeichen;
  private String bild;

  private Integer flugstunden;
  private Integer flugkilometer;
  private Double treibstoffverbrauch;
  private Integer frachtkapazitaet;
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
  public String getStatus() {
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

  /* ===================== JSON ===================== */

  public JsonObject toJson() {
    return new JsonObject()
      .put("id", id != null ? id.toString() : null)
      .put("flugzeugbesitzerId", flugzeugbesitzerId != null ? flugzeugbesitzerId.toString() : null)
      .put("flugzeugtyp", flugzeugtyp != null ? flugzeugtyp.name() : null)
      .put("flugzeuggroesse", flugzeuggroesse != null ? flugzeuggroesse.name() : null)
      .put("kennzeichen", kennzeichen)
      .put("bild", bild)
      .put("status", status)
      .put("flugstunden", flugstunden)
      .put("flugkilometer", flugkilometer)
      .put("treibstoffverbrauch", treibstoffverbrauch)
      .put("frachtkapazitaet", frachtkapazitaet);

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
}

