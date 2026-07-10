import { TimeSeriesBucketEnum } from '../../timeseries/dto/time-series.controller.dto';
import { TimeSeriesSampleRepository } from '../../timeseries/repositories/time-series.repository';

describe('TimeSeriesSampleRepository', () => {
  it('creates one sample through save', async () => {
    const repository = Object.create(TimeSeriesSampleRepository.prototype) as TimeSeriesSampleRepository & {
      save: jest.Mock;
    };
    repository.save = jest.fn().mockResolvedValue({
      id: 1,
      seriesKey: 'temperature.sensor-01',
      metricName: 'temperature',
      value: 27.5,
    });

    const sample = await repository.createOneByDTO({
      seriesKey: 'temperature.sensor-01',
      metricName: 'temperature',
      value: 27.5,
      recordedAt: '2026-07-10T08:00:00.000Z',
      tags: { region: 'tw-north' },
      source: 'edge-1',
    });

    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
      seriesKey: 'temperature.sensor-01',
      metricName: 'temperature',
      value: 27.5,
      source: 'edge-1',
    }));
    expect(sample.id).toBe(1);
  });

  it('creates many samples through save', async () => {
    const repository = Object.create(TimeSeriesSampleRepository.prototype) as TimeSeriesSampleRepository & {
      save: jest.Mock;
    };
    repository.save = jest.fn().mockResolvedValue([
      { id: 1, seriesKey: 'temperature.sensor-01' },
      { id: 2, seriesKey: 'temperature.sensor-02' },
    ]);

    const samples = await repository.createManyByDTO({
      items: [
        {
          seriesKey: 'temperature.sensor-01',
          metricName: 'temperature',
          value: 27.5,
          recordedAt: '2026-07-10T08:00:00.000Z',
        },
        {
          seriesKey: 'temperature.sensor-02',
          metricName: 'temperature',
          value: 28.1,
          recordedAt: '2026-07-10T09:00:00.000Z',
        },
      ],
    });

    expect(repository.save).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ seriesKey: 'temperature.sensor-01' }),
      expect.objectContaining({ seriesKey: 'temperature.sensor-02' }),
    ]));
    expect(samples).toHaveLength(2);
  });

  it('queries samples with pagination and optional metric filter', async () => {
    const builder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([
        [{ id: 1, seriesKey: 'temperature.sensor-01' }],
        1,
      ]),
    };
    const repository = Object.create(TimeSeriesSampleRepository.prototype) as TimeSeriesSampleRepository & {
      createQueryBuilder: jest.Mock;
    };
    repository.createQueryBuilder = jest.fn().mockReturnValue(builder);

    const result = await repository.findManyByDTO({
      seriesKey: 'temperature.sensor-01',
      metricName: 'temperature',
      startAt: '2026-07-10T00:00:00.000Z',
      endAt: '2026-07-11T00:00:00.000Z',
      limit: 10,
      offset: 0,
    });

    expect(repository.createQueryBuilder).toHaveBeenCalledWith('samples');
    expect(builder.andWhere).toHaveBeenCalledWith('samples.metricName = :metricName', { metricName: 'temperature' });
    expect(builder.limit).toHaveBeenCalledWith(10);
    expect(result.pagination.totalCount).toBe(1);
  });

  it('summarizes samples by bucket and returns numeric aggregates', async () => {
    const builder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      setParameter: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([
        {
          bucketAt: '2026-07-10T08:00:00.000Z',
          count: '2',
          minValue: '20',
          maxValue: '30',
          avgValue: '25',
          sumValue: '50',
        },
      ]),
    };
    const repository = Object.create(TimeSeriesSampleRepository.prototype) as TimeSeriesSampleRepository & {
      createQueryBuilder: jest.Mock;
    };
    repository.createQueryBuilder = jest.fn().mockReturnValue(builder);

    const summary = await repository.summarizeByDTO({
      seriesKey: 'temperature.sensor-01',
      metricName: 'temperature',
      startAt: '2026-07-10T00:00:00.000Z',
      endAt: '2026-07-11T00:00:00.000Z',
      bucket: TimeSeriesBucketEnum.HOUR,
      limit: 10,
      offset: 0,
    });

    expect(builder.setParameter).toHaveBeenCalledWith('bucket', TimeSeriesBucketEnum.HOUR);
    expect(summary.items[0].count).toBe(2);
    expect(summary.bucket).toBe(TimeSeriesBucketEnum.HOUR);
  });

  it('aggregates samples for downsample operations', async () => {
    const builder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      addGroupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      setParameter: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([
        {
          metricName: 'temperature',
          bucketAt: '2026-07-10T08:00:00.000Z',
          count: '2',
          minValue: '20',
          maxValue: '30',
          avgValue: '25',
          sumValue: '50',
        },
      ]),
    };
    const repository = Object.create(TimeSeriesSampleRepository.prototype) as TimeSeriesSampleRepository & {
      createQueryBuilder: jest.Mock;
    };
    repository.createQueryBuilder = jest.fn().mockReturnValue(builder);

    const items = await repository.aggregateByDTO({
      seriesKey: 'temperature.sensor-01',
      metricName: 'temperature',
      startAt: '2026-07-10T00:00:00.000Z',
      endAt: '2026-07-11T00:00:00.000Z',
      bucket: TimeSeriesBucketEnum.HOUR,
    });

    expect(builder.addGroupBy).toHaveBeenCalledWith('bucketAt');
    expect(items[0].metricName).toBe('temperature');
    expect(items[0].count).toBe(2);
  });

  it('deletes old raw samples using the cutoff', async () => {
    const builder = {
      delete: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 7 }),
    };
    const repository = Object.create(TimeSeriesSampleRepository.prototype) as TimeSeriesSampleRepository & {
      createQueryBuilder: jest.Mock;
    };
    repository.createQueryBuilder = jest.fn().mockReturnValue(builder);

    const deletedCount = await repository.deleteOlderThanByDTO({
      seriesKey: 'temperature.sensor-01',
      metricName: 'temperature',
      olderThan: '2026-06-10T00:00:00.000Z',
      pruneRollups: true,
    });

    expect(builder.where).toHaveBeenCalledWith('seriesKey = :seriesKey', { seriesKey: 'temperature.sensor-01' });
    expect(builder.andWhere).toHaveBeenCalledWith('metricName = :metricName', { metricName: 'temperature' });
    expect(deletedCount).toBe(7);
  });
});
