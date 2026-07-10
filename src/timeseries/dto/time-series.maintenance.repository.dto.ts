import { TimeSeriesBucketEnum } from './time-series.controller.dto';

export class DownsampleTimeSeriesSamplesDTO {
  seriesKey: string;
  metricName?: string;
  startAt: string;
  endAt: string;
  bucket: TimeSeriesBucketEnum;
  replaceExisting: boolean;
}

export class PruneTimeSeriesSamplesDTO {
  seriesKey?: string;
  metricName?: string;
  olderThan: string;
  pruneRollups: boolean;
}
