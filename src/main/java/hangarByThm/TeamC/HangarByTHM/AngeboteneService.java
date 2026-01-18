package hangarByThm.TeamC.HangarByTHM;

import io.vertx.core.json.JsonObject;
import java.util.UUID;
public class AngeboteneService {
  private UUID hangaranbieterId;
  private Integer serviceId;
  private ServicenameEnum bezeichnung;
  private Double preis;
  private String einheit;

  /* GETTERS / SETTERS */

  public JsonObject toJson() {
    return new JsonObject()
      .put("serviceId", serviceId)
      .put("bezeichnung", bezeichnung.toString())
      .put("preis", preis)
      .put("einheit", einheit);
  }
  public static AngeboteneService fromJson(JsonObject json) {
    AngeboteneService s = new AngeboteneService();

    s.bezeichnung = ServicenameEnum.valueOf(json.getString("bezeichnung"));
    s.preis = json.getDouble("preis");
    s.einheit = json.getString("einheit");

    return s;
  }


  public static AngeboteneService fromRow(io.vertx.sqlclient.Row row) {
    AngeboteneService s = new AngeboteneService();
    s.serviceId = row.getInteger("service_id");
    s.bezeichnung = ServicenameEnum.valueOf(row.getString("bezeichnung"));
    s.preis = row.getDouble("preis");
    s.einheit = row.getString("einheit");
    return s;
  }
}
