import { MigrationInterface, QueryRunner, Table } from "typeorm";

const table = "time_series_samples";

export class TimeSeriesSamples1783641600000 implements MigrationInterface {
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
          name: "value",
          type: "double precision",
        },
        {
          name: "recordedAt",
          type: "timestamp with time zone",
        },
        {
          name: "tags",
          type: "jsonb",
          default: "'{}'::jsonb",
        },
        {
          name: "source",
          type: "varchar",
          isNullable: true,
        },
      ],
      indices: [
        {
          name: "idx_time_series_samples_series_metric_recorded_at",
          columnNames: ["seriesKey", "metricName", "recordedAt"],
        },
        {
          name: "idx_time_series_samples_recorded_at",
          columnNames: ["recordedAt"],
        },
      ]
    }));

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'timescaledb') THEN
          PERFORM create_hypertable('${table}'::regclass, 'recordedAt');
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(table);
  }
}
