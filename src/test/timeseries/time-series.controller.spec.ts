import { getMockReq } from '@jest-mock/express';
import { V1TimeSeriesController } from '../../timeseries/time-series.controller';
import { TimeSeriesBucketEnum } from '../../timeseries/dto/time-series.controller.dto';

describe('V1TimeSeriesController', () => {
  it('creates one time series sample through the service', async () => {
    const timeSeriesService = {
      createOneTimeSeriesSampleByDTO: jest.fn().mockResolvedValue({
        id: 1,
        seriesKey: 'temperature.sensor-01',
        metricName: 'temperature',
        value: 27.5,
      }),
    } as any;
    const controller = new V1TimeSeriesController(timeSeriesService);
    const request = getMockReq({
      body: {
        seriesKey: 'temperature.sensor-01',
        metricName: 'temperature',
        value: 27.5,
      },
    });

    const result = await controller.createTimeSeriesSampleByDTO(request);

    expect(timeSeriesService.createOneTimeSeriesSampleByDTO).toHaveBeenCalledWith(
      expect.objectContaining({
        seriesKey: 'temperature.sensor-01',
        metricName: 'temperature',
        value: 27.5,
      })
    );
    expect(result.seriesKey).toBe('temperature.sensor-01');
  });

  it('creates many time series samples through the service', async () => {
    const timeSeriesService = {
      createManyTimeSeriesSamplesByDTO: jest.fn().mockResolvedValue([
        {
          id: 1,
          seriesKey: 'temperature.sensor-01',
          metricName: 'temperature',
          value: 27.5,
        },
      ]),
    } as any;
    const controller = new V1TimeSeriesController(timeSeriesService);
    const request = getMockReq({
      body: {
        items: [
          {
            seriesKey: 'temperature.sensor-01',
            metricName: 'temperature',
            value: 27.5,
          },
        ],
      },
    });

    const result = await controller.createTimeSeriesSamplesByDTO(request);

    expect(timeSeriesService.createManyTimeSeriesSamplesByDTO).toHaveBeenCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({
            seriesKey: 'temperature.sensor-01',
            metricName: 'temperature',
            value: 27.5,
          }),
        ]),
      })
    );
    expect(result[0].id).toBe(1);
  });

  it('queries samples by validated range and pagination values', async () => {
    const timeSeriesService = {
      findManyTimeSeriesSamplesByDTO: jest.fn().mockResolvedValue({
        items: [
          {
            id: 1,
            seriesKey: 'temperature.sensor-01',
            metricName: 'temperature',
            value: 27.5,
          },
        ],
        pagination: {
          limit: 10,
          offset: 0,
          totalCount: 1,
        },
      }),
    } as any;
    const controller = new V1TimeSeriesController(timeSeriesService);
    const request = getMockReq({
      query: {
        seriesKey: 'temperature.sensor-01',
        startAt: '2026-07-10T00:00:00.000Z',
        endAt: '2026-07-11T00:00:00.000Z',
        limit: '10',
        offset: '0',
      },
    });

    const result = await controller.findTimeSeriesSamplesByDTO(request);

    expect(timeSeriesService.findManyTimeSeriesSamplesByDTO).toHaveBeenCalledWith(
      expect.objectContaining({
        seriesKey: 'temperature.sensor-01',
        startAt: '2026-07-10T00:00:00.000Z',
        endAt: '2026-07-11T00:00:00.000Z',
        limit: 10,
        offset: 0,
      })
    );
    expect(result.pagination.totalCount).toBe(1);
  });

  it('summarizes samples by bucket', async () => {
    const timeSeriesService = {
      summarizeTimeSeriesSamplesByDTO: jest.fn().mockResolvedValue({
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
    const controller = new V1TimeSeriesController(timeSeriesService);
    const request = getMockReq({
      query: {
        seriesKey: 'temperature.sensor-01',
        startAt: '2026-07-10T00:00:00.000Z',
        endAt: '2026-07-11T00:00:00.000Z',
        bucket: TimeSeriesBucketEnum.HOUR,
      },
    });

    const result = await controller.summarizeTimeSeriesSamplesByDTO(request);

    expect(timeSeriesService.summarizeTimeSeriesSamplesByDTO).toHaveBeenCalledWith(
      expect.objectContaining({
        bucket: TimeSeriesBucketEnum.HOUR,
      })
    );
    expect(result.items[0].count).toBe(2);
  });

  it('downsamples samples into rollups', async () => {
    const timeSeriesService = {
      downsampleTimeSeriesSamplesByDTO: jest.fn().mockResolvedValue({
        downsampledCount: 1,
        replacedCount: 1,
        deletedRawCount: 0,
        deletedRollupCount: 0,
      }),
    } as any;
    const controller = new V1TimeSeriesController(timeSeriesService);
    const request = getMockReq({
      body: {
        seriesKey: 'temperature.sensor-01',
        startAt: '2026-07-10T00:00:00.000Z',
        endAt: '2026-07-11T00:00:00.000Z',
        bucket: TimeSeriesBucketEnum.HOUR,
        replaceExisting: true,
      },
    });

    const result = await controller.downsampleTimeSeriesSamplesByDTO(request);

    expect(timeSeriesService.downsampleTimeSeriesSamplesByDTO).toHaveBeenCalledWith(
      expect.objectContaining({
        replaceExisting: true,
        bucket: TimeSeriesBucketEnum.HOUR,
      })
    );
    expect(result.downsampledCount).toBe(1);
  });

  it('prunes raw samples and rollups when requested', async () => {
    const timeSeriesService = {
      pruneTimeSeriesSamplesByDTO: jest.fn().mockResolvedValue({
        downsampledCount: 0,
        replacedCount: 0,
        deletedRawCount: 10,
        deletedRollupCount: 2,
      }),
    } as any;
    const controller = new V1TimeSeriesController(timeSeriesService);
    const request = getMockReq({
      body: {
        olderThan: '2026-06-10T00:00:00.000Z',
        pruneRollups: true,
      },
    });

    const result = await controller.pruneTimeSeriesSamplesByDTO(request);

    expect(timeSeriesService.pruneTimeSeriesSamplesByDTO).toHaveBeenCalledWith(
      expect.objectContaining({
        olderThan: '2026-06-10T00:00:00.000Z',
        pruneRollups: true,
      })
    );
    expect(result.deletedRollupCount).toBe(2);
  });
});
