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
    const timeSeriesService = new V1TimeSeriesService(timeSeriesSampleRepository);

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
    const timeSeriesService = new V1TimeSeriesService(timeSeriesSampleRepository);

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
});
