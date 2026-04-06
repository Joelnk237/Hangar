package hangarByThm.TeamC.HangarByTHM;

import io.vertx.core.json.JsonObject;

import java.util.UUID;

public class Zusatzservice {
  private Integer id;
  private UUID hangaranbieterId;
  private String bezeichnung;
  private String beschreibung;
  private Double preis;
  private String einheit;

  public JsonObject toJson() {
    return new JsonObject()
      .put("id", id)
      .put("bezeichnung", bezeichnung)
      .put("beschreibung", beschreibung)
      .put("preis", preis)
      .put("einheit", einheit);
  }

  public static Zusatzservice fromJson(JsonObject json) {
    Zusatzservice z = new Zusatzservice();

    z.bezeichnung = json.getString("bezeichnung");
    z.beschreibung = json.getString("beschreibung");
    z.preis = json.getDouble("preis");
    z.einheit = json.getString("einheit");

    return z;
  }

  public static Zusatzservice fromRow(io.vertx.sqlclient.Row row) {
    Zusatzservice z = new Zusatzservice();
    z.id = row.getInteger("id");
    z.bezeichnung = row.getString("bezeichnung");
    z.beschreibung = row.getString("beschreibung");
    z.preis = row.getDouble("preis");
    z.einheit = row.getString("einheit");
    return z;
  }
}
