import { V1TimeSeriesService } from '../../timeseries/time-series.service';
import { TimeSeriesBucketEnum } from '../../timeseries/dto/time-series.controller.dto';
import { ErrorMessageEnum } from '../../common/constants';

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

  it('creates many time series samples through the injected repository', async () => {
    const timeSeriesSampleRepository = {
      createManyByDTO: jest.fn().mockResolvedValue([
        {
          id: 1,
          seriesKey: 'temperature.sensor-01',
          metricName: 'temperature',
          value: 27.5,
        },
        {
          id: 2,
          seriesKey: 'temperature.sensor-02',
          metricName: 'temperature',
          value: 28.1,
        },
      ]),
    } as any;
    const timeSeriesService = new V1TimeSeriesService(timeSeriesSampleRepository, {} as any);

    const samples = await timeSeriesService.createManyTimeSeriesSamplesByDTO({
      items: [
        {
          seriesKey: 'temperature.sensor-01',
          metricName: 'temperature',
          value: 27.5,
        },
        {
          seriesKey: 'temperature.sensor-02',
          metricName: 'temperature',
          value: 28.1,
        },
      ],
    });

    expect(timeSeriesSampleRepository.createManyByDTO).toHaveBeenCalledWith({
      items: expect.arrayContaining([
        expect.objectContaining({ seriesKey: 'temperature.sensor-01' }),
        expect.objectContaining({ seriesKey: 'temperature.sensor-02' }),
      ]),
    });
    expect(samples).toHaveLength(2);
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

  it('rejects invalid time series ranges before querying the repository', async () => {
    const timeSeriesSampleRepository = {
      findManyByDTO: jest.fn(),
    } as any;
    const timeSeriesService = new V1TimeSeriesService(timeSeriesSampleRepository, {} as any);

    await expect(timeSeriesService.findManyTimeSeriesSamplesByDTO({
      seriesKey: 'temperature.sensor-01',
      startAt: '2026-07-11T00:00:00.000Z',
      endAt: '2026-07-10T00:00:00.000Z',
      limit: 10,
      offset: 0,
    })).rejects.toMatchObject({
      errorType: ErrorMessageEnum.TEMPLATE_TIME_SERIES_RANGE_INVALID,
    });

    expect(timeSeriesSampleRepository.findManyByDTO).not.toHaveBeenCalled();
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

  it('downsamples without replacing existing rollups when replaceExisting is false', async () => {
    const timeSeriesSampleRepository = {
      aggregateByDTO: jest.fn().mockResolvedValue([
        {
          metricName: 'temperature',
          bucketAt: '2026-07-10T08:00:00.000Z',
          count: 1,
          minValue: 21,
          maxValue: 21,
          avgValue: 21,
          sumValue: 21,
        },
      ]),
    } as any;
    const timeSeriesRollupRepository = {
      replaceManyByDTO: jest.fn().mockResolvedValue({
        items: [],
        replacedCount: 0,
      }),
    } as any;
    const timeSeriesService = new V1TimeSeriesService(timeSeriesSampleRepository, timeSeriesRollupRepository);

    await timeSeriesService.downsampleTimeSeriesSamplesByDTO({
      seriesKey: 'temperature.sensor-01',
      startAt: '2026-07-10T00:00:00.000Z',
      endAt: '2026-07-11T00:00:00.000Z',
      bucket: TimeSeriesBucketEnum.HOUR,
      replaceExisting: false,
    });

    expect(timeSeriesRollupRepository.replaceManyByDTO).toHaveBeenCalledWith(
      expect.objectContaining({ replaceExisting: false }),
      expect.any(Array)
    );
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

  it('prunes only raw samples when pruneRollups is false', async () => {
    const timeSeriesSampleRepository = {
      deleteOlderThanByDTO: jest.fn().mockResolvedValue(4),
    } as any;
    const timeSeriesRollupRepository = {
      deleteOlderThanByDTO: jest.fn(),
    } as any;
    const timeSeriesService = new V1TimeSeriesService(timeSeriesSampleRepository, timeSeriesRollupRepository);

    const result = await timeSeriesService.pruneTimeSeriesSamplesByDTO({
      olderThan: '2026-06-10T00:00:00.000Z',
      pruneRollups: false,
    });

    expect(timeSeriesRollupRepository.deleteOlderThanByDTO).not.toHaveBeenCalled();
    expect(result.deletedRawCount).toBe(4);
    expect(result.deletedRollupCount).toBe(0);
  });
});
