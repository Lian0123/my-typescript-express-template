import { TimeSeriesBucketEnum } from './time-series.controller.dto';

export class CreateOneTimeSeriesSampleDTO {
  seriesKey: string;
  metricName: string;
  value: number;
  recordedAt?: string;
  tags?: Record<string, unknown>;
  source?: string;
}

export class CreateManyTimeSeriesSamplesDTO {
  items: CreateOneTimeSeriesSampleDTO[];
}

export class FindManyTimeSeriesSamplesDTO {
  seriesKey: string;
  metricName?: string;
  startAt: string;
  endAt: string;
  limit: number;
  offset: number;
}

export class FindManyTimeSeriesSummaryDTO extends FindManyTimeSeriesSamplesDTO {
  bucket: TimeSeriesBucketEnum;
}
