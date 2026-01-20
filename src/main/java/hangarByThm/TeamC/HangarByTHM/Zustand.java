package hangarByThm.TeamC.HangarByTHM;


import io.vertx.core.json.JsonObject;
import io.vertx.sqlclient.Row;

import java.util.UUID;

public class Zustand {

  private UUID flugzeugId;
  private UUID stellplatzId;

  private String fahrbereitschaft;
  private String beschreibung;
  private String wartung;

  // ---------- Getters & Setters ----------

  public UUID getFlugzeugId() {
    return flugzeugId;
  }

  public void setFlugzeugId(UUID flugzeugId) {
    this.flugzeugId = flugzeugId;
  }

  public UUID getStellplatzId() {
    return stellplatzId;
  }

  public void setStellplatzId(UUID stellplatzId) {
    this.stellplatzId = stellplatzId;
  }

  public String getFahrbereitschaft() {
    return fahrbereitschaft;
  }

  public void setFahrbereitschaft(String fahrbereitschaft) {
    this.fahrbereitschaft = fahrbereitschaft;
  }

  public String getBeschreibung() {
    return beschreibung;
  }

  public void setBeschreibung(String beschreibung) {
    this.beschreibung = beschreibung;
  }

  public String getWartung() {
    return wartung;
  }

  public void setWartung(String wartung) {
    this.wartung = wartung;
  }

  // ---------- JSON ----------

  public JsonObject toJson() {
    return new JsonObject()
      .put("flugzeugId", flugzeugId != null ? flugzeugId.toString() : null)
      .put("stellplatzId", stellplatzId != null ? stellplatzId.toString() : null)
      .put("fahrbereitschaft", fahrbereitschaft)
      .put("beschreibung", beschreibung)
      .put("wartung", wartung);
  }

  /**
   * Erwartete JSON-Struktur:
   * {
   *   flugzeug: { id: "UUID", ... },
   *   stellplatz: { id: "UUID", ... },
   *   fahrbereitschaft: string,
   *   beschreibung: string,
   *   wartung: string
   * }
   */
  public static Zustand fromJson(JsonObject json) {

    Zustand zustand = new Zustand();

    JsonObject flugzeug = json.getJsonObject("flugzeug");
    JsonObject stellplatz = json.getJsonObject("stellplatz");

    if (flugzeug != null && flugzeug.getString("id") != null) {
      zustand.setFlugzeugId(
        UUID.fromString(flugzeug.getString("id"))
      );
    }

    if (stellplatz != null && stellplatz.getString("id") != null) {
      zustand.setStellplatzId(
        UUID.fromString(stellplatz.getString("id"))
      );
    }

    if (json.getString("fahrbereitschaft") != null) {
      zustand.setFahrbereitschaft(json.getString("fahrbereitschaft"));
    }

    if (json.getString("beschreibung") != null) {
      zustand.setBeschreibung(json.getString("beschreibung"));
    }

    if (json.getString("wartung") != null) {
      zustand.setWartung(json.getString("wartung"));
    }

    return zustand;
  }

  // ---------- Row → Objekt ----------

  public static Zustand fromRow(Row row) {

    Zustand zustand = new Zustand();

    zustand.setFlugzeugId(row.getUUID("flugzeug_id"));
    zustand.setStellplatzId(row.getUUID("stellplatz_id"));

    zustand.setFahrbereitschaft(row.getString("fahrbereitschaft"));
    zustand.setBeschreibung(row.getString("beschreibung"));
    zustand.setWartung(row.getString("wartung"));

    return zustand;
  }
}

