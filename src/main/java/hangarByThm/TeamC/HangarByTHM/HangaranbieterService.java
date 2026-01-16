package hangarByThm.TeamC.HangarByTHM;

import io.vertx.core.Future;
import io.vertx.sqlclient.SqlClient;
import io.vertx.sqlclient.Tuple;

import java.util.UUID;

public class HangaranbieterService {
  private final SqlClient client;

  public HangaranbieterService(SqlClient client) {
    this.client = client;
  }

  public Future<UUID> getHAnbieterId(UUID benutzerId) {

    String sql = "SELECT id FROM hangaranbieter WHERE benutzer_id = $1";

    return client
      .preparedQuery(sql)
      .execute(Tuple.of(benutzerId))
      .compose(rows -> {
        if (!rows.iterator().hasNext()) {
          return Future.failedFuture("Hangaranbieter nicht gefunden");
        }
        return Future.succeededFuture(
          rows.iterator().next().getUUID("id")
        );
      });
  }
}
