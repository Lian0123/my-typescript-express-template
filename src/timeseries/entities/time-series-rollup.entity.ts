/* Import Package */
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/* Inject Reference */
import 'reflect-metadata';

/* Constant */
import { TIME_SERIES_ROLLUP_TABLE } from '../constants/time-series.constant';

@Index('idx_time_series_rollups_series_metric_bucket_at', ['seriesKey', 'metricName', 'bucket', 'bucketAt'], { unique: true })
@Index('idx_time_series_rollups_bucket_at', ['bucketAt'])
@Entity({ name: TIME_SERIES_ROLLUP_TABLE })
export class TimeSeriesRollupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seriesKey: string;

  @Column()
  metricName: string;

  @Column()
  bucket: string;

  @Column({ type: 'timestamp with time zone' })
  bucketAt: Date;

  @Column('bigint')
  count: number;

  @Column('double precision')
  minValue: number;

  @Column('double precision')
  maxValue: number;

  @Column('double precision')
  avgValue: number;

  @Column('double precision')
  sumValue: number;
}
