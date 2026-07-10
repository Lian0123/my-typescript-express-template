import { TimeSeriesBucketEnum } from '../../timeseries/dto/time-series.controller.dto';
import { TimeSeriesRollupRepository } from '../../timeseries/repositories/time-series-rollup.repository';

describe('TimeSeriesRollupRepository', () => {
  it('replaces existing rollups before inserting new ones', async () => {
    const builder = {
      delete: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 2 }),
    };
    const repository = Object.create(TimeSeriesRollupRepository.prototype) as TimeSeriesRollupRepository & {
      createQueryBuilder: jest.Mock;
      save: jest.Mock;
    };
    repository.createQueryBuilder = jest.fn().mockReturnValue(builder);
    repository.save = jest.fn().mockResolvedValue([
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
    ]);

    const result = await repository.replaceManyByDTO({
      seriesKey: 'temperature.sensor-01',
      metricName: 'temperature',
      startAt: '2026-07-10T00:00:00.000Z',
      endAt: '2026-07-11T00:00:00.000Z',
      bucket: TimeSeriesBucketEnum.HOUR,
      replaceExisting: true,
    }, [
      {
        metricName: 'temperature',
        bucketAt: '2026-07-10T08:00:00.000Z',
        count: 2,
        minValue: 20,
        maxValue: 30,
        avgValue: 25,
        sumValue: 50,
      },
    ]);

    expect(builder.execute).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        seriesKey: 'temperature.sensor-01',
        metricName: 'temperature',
        bucket: TimeSeriesBucketEnum.HOUR,
      }),
    ]));
    expect(result.replacedCount).toBe(2);
  });

  it('skips deleting existing rollups when replaceExisting is false', async () => {
    const builder = {
      delete: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 0 }),
    };
    const repository = Object.create(TimeSeriesRollupRepository.prototype) as TimeSeriesRollupRepository & {
      createQueryBuilder: jest.Mock;
      save: jest.Mock;
    };
    repository.createQueryBuilder = jest.fn().mockReturnValue(builder);
    repository.save = jest.fn().mockResolvedValue([
      {
        id: 1,
        seriesKey: 'temperature.sensor-01',
        metricName: 'temperature',
        bucket: TimeSeriesBucketEnum.HOUR,
        bucketAt: '2026-07-10T08:00:00.000Z',
        count: 1,
        minValue: 21,
        maxValue: 21,
        avgValue: 21,
        sumValue: 21,
      },
    ]);

    const result = await repository.replaceManyByDTO({
      seriesKey: 'temperature.sensor-01',
      startAt: '2026-07-10T00:00:00.000Z',
      endAt: '2026-07-11T00:00:00.000Z',
      bucket: TimeSeriesBucketEnum.HOUR,
      replaceExisting: false,
    }, [
      {
        metricName: 'temperature',
        bucketAt: '2026-07-10T08:00:00.000Z',
        count: 1,
        minValue: 21,
        maxValue: 21,
        avgValue: 21,
        sumValue: 21,
      },
    ]);

    expect(builder.execute).not.toHaveBeenCalled();
    expect(result.replacedCount).toBe(0);
  });

  it('deletes old rollups with the same cutoff', async () => {
    const builder = {
      delete: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 3 }),
    };
    const repository = Object.create(TimeSeriesRollupRepository.prototype) as TimeSeriesRollupRepository & {
      createQueryBuilder: jest.Mock;
    };
    repository.createQueryBuilder = jest.fn().mockReturnValue(builder);

    const deletedCount = await repository.deleteOlderThanByDTO({
      seriesKey: 'temperature.sensor-01',
      olderThan: '2026-06-10T00:00:00.000Z',
      pruneRollups: true,
    });

    expect(builder.where).toHaveBeenCalledWith('seriesKey = :seriesKey', { seriesKey: 'temperature.sensor-01' });
    expect(deletedCount).toBe(3);
  });
});
