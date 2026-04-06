package hangarByThm.TeamC.HangarByTHM;

import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonArray;
import io.vertx.sqlclient.SqlClient;
import io.vertx.sqlclient.Tuple;

import java.util.UUID;

public class ZusatzserviceRepository {

  private final SqlClient client;

  public ZusatzserviceRepository(SqlClient client) {
    this.client = client;
  }

  public Future<JsonArray> findByHangaranbieterId(UUID hangaranbieterId) {
    String sql = """
      SELECT *
      FROM zusatzservice
      WHERE hangaranbieter_id = $1
    """;

    Promise<JsonArray> promise = Promise.promise();

    client
      .preparedQuery(sql)
      .execute(Tuple.of(hangaranbieterId))
      .onSuccess(rows -> {
        JsonArray result = new JsonArray();
        rows.forEach(row ->
          result.add(Zusatzservice.fromRow(row).toJson())
        );
        promise.complete(result);
      })
      .onFailure(promise::fail);

    return promise.future();
  }
}

