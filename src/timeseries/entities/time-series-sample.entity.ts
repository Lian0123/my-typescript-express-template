/* Import Package */
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/* Inject Reference */
import 'reflect-metadata';

/* Constant */
import { TIME_SERIES_SAMPLE_TABLE } from '../constants/time-series.constant';

@Index('idx_time_series_samples_series_metric_recorded_at', ['seriesKey', 'metricName', 'recordedAt'])
@Index('idx_time_series_samples_recorded_at', ['recordedAt'])
@Entity({ name: TIME_SERIES_SAMPLE_TABLE })
export class TimeSeriesSampleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seriesKey: string;

  @Column()
  metricName: string;

  @Column('double precision')
  value: number;

  @Column({ type: 'timestamp with time zone' })
  recordedAt: Date;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  tags: Record<string, unknown>;

  @Column({ nullable: true })
  source?: string;
}
