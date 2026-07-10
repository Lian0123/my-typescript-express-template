import { V1TimeSeriesService } from '../../timeseries/time-series.service';
import { TimeSeriesBucketEnum } from '../../timeseries/dto/time-series.controller.dto';

describe('V1TimeSeriesService', () => {
  it('creates one time series sample through the injected repository', async () => {
    const timeSeriesSampleRepository = {
      createOneByDTO: jest.fn().mockResolvedValue({
        id: 1,
        seriesKey: 'temperature.sensor-01',
        metricName: 'temperature',
        value: 27.5,
      }),
    } as any;
    const timeSeriesService = new V1TimeSeriesService(timeSeriesSampleRepository, {} as any);

    const sample = await timeSeriesService.createOneTimeSeriesSampleByDTO({
      seriesKey: 'temperature.sensor-01',
      metricName: 'temperature',
      value: 27.5,
    });

    expect(timeSeriesSampleRepository.createOneByDTO).toHaveBeenCalledWith({
      seriesKey: 'temperature.sensor-01',
      metricName: 'temperature',
      value: 27.5,
    });
    expect(sample.seriesKey).toBe('temperature.sensor-01');
  });

  it('summarizes a time series range with the requested bucket', async () => {
    const timeSeriesSampleRepository = {
      summarizeByDTO: jest.fn().mockResolvedValue({
        seriesKey: 'temperature.sensor-01',
        metricName: 'temperature',
        bucket: TimeSeriesBucketEnum.HOUR,
        startAt: '2026-07-10T00:00:00.000Z',
        endAt: '2026-07-11T00:00:00.000Z',
        items: [
          {
            bucketAt: '2026-07-10T08:00:00.000Z',
            count: 2,
            minValue: 20,
            maxValue: 30,
            avgValue: 25,
            sumValue: 50,
          },
        ],
      }),
    } as any;
    const timeSeriesService = new V1TimeSeriesService(timeSeriesSampleRepository, {} as any);

    const summary = await timeSeriesService.summarizeTimeSeriesSamplesByDTO({
      seriesKey: 'temperature.sensor-01',
      metricName: 'temperature',
      startAt: '2026-07-10T00:00:00.000Z',
      endAt: '2026-07-11T00:00:00.000Z',
      bucket: TimeSeriesBucketEnum.HOUR,
      limit: 10,
      offset: 0,
    });

    expect(timeSeriesSampleRepository.summarizeByDTO).toHaveBeenCalledWith({
      seriesKey: 'temperature.sensor-01',
      metricName: 'temperature',
      startAt: '2026-07-10T00:00:00.000Z',
      endAt: '2026-07-11T00:00:00.000Z',
      bucket: TimeSeriesBucketEnum.HOUR,
      limit: 10,
      offset: 0,
    });
    expect(summary.items[0].count).toBe(2);
  });

  it('downsamples time series samples into rollups', async () => {
    const timeSeriesSampleRepository = {
      aggregateByDTO: jest.fn().mockResolvedValue([
        {
          metricName: 'temperature',
          bucketAt: '2026-07-10T08:00:00.000Z',
          count: 2,
          minValue: 20,
          maxValue: 30,
          avgValue: 25,
          sumValue: 50,
        },
      ]),
    } as any;
    const timeSeriesRollupRepository = {
      replaceManyByDTO: jest.fn().mockResolvedValue({
        items: [
          {
            id: 1,
            seriesKey: 'temperature.sensor-01',
            metricName: 'temperature',
            bucket: TimeSeriesBucketEnum.HOUR,
            bucketAt: '2026-07-10T08:00:00.000Z',
            count: 2,
            minValue: 20,
            maxValue: 30,
            avgValue: 25,
            sumValue: 50,
          },
        ],
        replacedCount: 1,
      }),
    } as any;
    const timeSeriesService = new V1TimeSeriesService(timeSeriesSampleRepository, timeSeriesRollupRepository);

    const result = await timeSeriesService.downsampleTimeSeriesSamplesByDTO({
      seriesKey: 'temperature.sensor-01',
      metricName: 'temperature',
      startAt: '2026-07-10T00:00:00.000Z',
      endAt: '2026-07-11T00:00:00.000Z',
      bucket: TimeSeriesBucketEnum.HOUR,
      replaceExisting: true,
    });

    expect(timeSeriesSampleRepository.aggregateByDTO).toHaveBeenCalled();
    expect(timeSeriesRollupRepository.replaceManyByDTO).toHaveBeenCalled();
    expect(result.downsampledCount).toBe(1);
    expect(result.replacedCount).toBe(1);
  });

  it('prunes old raw samples and optionally rollups', async () => {
    const timeSeriesSampleRepository = {
      deleteOlderThanByDTO: jest.fn().mockResolvedValue(10),
    } as any;
    const timeSeriesRollupRepository = {
      deleteOlderThanByDTO: jest.fn().mockResolvedValue(2),
    } as any;
    const timeSeriesService = new V1TimeSeriesService(timeSeriesSampleRepository, timeSeriesRollupRepository);

    const result = await timeSeriesService.pruneTimeSeriesSamplesByDTO({
      olderThan: '2026-06-10T00:00:00.000Z',
      pruneRollups: true,
    });

    expect(timeSeriesSampleRepository.deleteOlderThanByDTO).toHaveBeenCalledWith({
      olderThan: '2026-06-10T00:00:00.000Z',
      pruneRollups: true,
    });
    expect(timeSeriesRollupRepository.deleteOlderThanByDTO).toHaveBeenCalledWith({
      olderThan: '2026-06-10T00:00:00.000Z',
      pruneRollups: true,
    });
    expect(result.deletedRawCount).toBe(10);
    expect(result.deletedRollupCount).toBe(2);
  });
});
