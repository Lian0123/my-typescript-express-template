import { MigrationInterface, QueryRunner, Table } from "typeorm";

const table = "time_series_rollups";

export class TimeSeriesRollups1783641600001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: table,
      columns: [
        {
          name: "id",
          type: "int",
          isPrimary: true,
          isGenerated: true,
          generationStrategy: "increment",
        },
        {
          name: "seriesKey",
          type: "varchar",
        },
        {
          name: "metricName",
          type: "varchar",
        },
        {
          name: "bucket",
          type: "varchar",
        },
        {
          name: "bucketAt",
          type: "timestamp with time zone",
        },
        {
          name: "count",
          type: "bigint",
        },
        {
          name: "minValue",
          type: "double precision",
        },
        {
          name: "maxValue",
          type: "double precision",
        },
        {
          name: "avgValue",
          type: "double precision",
        },
        {
          name: "sumValue",
          type: "double precision",
        }
      ],
      indices: [
        {
          name: "idx_time_series_rollups_series_metric_bucket_at",
          columnNames: ["seriesKey", "metricName", "bucket", "bucketAt"],
          isUnique: true,
        },
        {
          name: "idx_time_series_rollups_bucket_at",
          columnNames: ["bucketAt"],
        }
      ]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(table);
  }
}
