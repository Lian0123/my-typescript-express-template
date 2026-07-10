/* Import Package */
import { decorate, injectable } from 'inversify';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

/* Entity */
import { TimeSeriesSampleEntity } from '../entities/time-series-sample.entity';

/* DTO */
import {
  CreateManyTimeSeriesSamplesDTO,
  CreateOneTimeSeriesSampleDTO,
  FindManyTimeSeriesSamplesDTO,
  FindManyTimeSeriesSummaryDTO
} from '../dto/time-series.repository.dto';
import {
  DownsampleTimeSeriesSamplesDTO,
  PruneTimeSeriesSamplesDTO
} from '../dto/time-series.maintenance.repository.dto';

/* Enum */
import { TimeSeriesBucketEnum } from '../dto/time-series.controller.dto';

/* PO */
import { TimeSeriesSamplePO, TimeSeriesSamplesPO, TimeSeriesSummaryItemPO, TimeSeriesSummaryPO } from '../po/time-series.po';

/* Inject Reference */
import 'reflect-metadata';

decorate(injectable(), TimeSeriesSampleEntity);

const toDate = (value: string | Date): Date => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.valueOf())) {
    throw new Error('invalid time series date');
  }
  return date;
};

const normalizeSample = (dto: CreateOneTimeSeriesSampleDTO): Partial<TimeSeriesSampleEntity> => ({
  seriesKey: dto.seriesKey,
  metricName: dto.metricName,
  value: dto.value,
  recordedAt: dto.recordedAt ? toDate(dto.recordedAt) : new Date(),
  tags: dto.tags || {},
  source: dto.source
});

@injectable()
@EntityRepository(TimeSeriesSampleEntity)
export class TimeSeriesSampleRepository extends BaseRepository<TimeSeriesSampleEntity> {
  async createOneByDTO (dto: CreateOneTimeSeriesSampleDTO): Promise<TimeSeriesSamplePO> {
    const rawData = await this.save(normalizeSample(dto));
    return TimeSeriesSamplePO.plainToClass(rawData);
  }

  async createManyByDTO (dto: CreateManyTimeSeriesSamplesDTO): Promise<TimeSeriesSamplePO[]> {
    const rawData = await this.save(dto.items.map((item) => normalizeSample(item)));
    return rawData.map((item) => TimeSeriesSamplePO.plainToClass(item));
  }

  async findManyByDTO (dto: FindManyTimeSeriesSamplesDTO): Promise<TimeSeriesSamplesPO> {
    const queryBuilder = this.createQueryBuilder('samples')
      .where('samples.seriesKey = :seriesKey', { seriesKey: dto.seriesKey })
      .andWhere('samples.recordedAt >= :startAt', { startAt: toDate(dto.startAt) })
      .andWhere('samples.recordedAt < :endAt', { endAt: toDate(dto.endAt) })
      .orderBy('samples.recordedAt', 'ASC')
      .offset(dto.offset)
      .limit(dto.limit);

    if (dto.metricName) {
      queryBuilder.andWhere('samples.metricName = :metricName', { metricName: dto.metricName });
    }

    const rawData = await queryBuilder.getManyAndCount();
    return {
      items: rawData[0].map((item) => TimeSeriesSamplePO.plainToClass(item)),
      pagination: {
        limit: dto.limit,
        offset: dto.offset,
        totalCount: rawData[1]
      }
    };
  }

  async summarizeByDTO (dto: FindManyTimeSeriesSummaryDTO): Promise<TimeSeriesSummaryPO> {
    const queryBuilder = this.createQueryBuilder('samples')
      .select(`date_trunc(:bucket, samples.recordedAt)`, 'bucketAt')
      .addSelect('COUNT(*)', 'count')
      .addSelect('MIN(samples.value)', 'minValue')
      .addSelect('MAX(samples.value)', 'maxValue')
      .addSelect('AVG(samples.value)', 'avgValue')
      .addSelect('SUM(samples.value)', 'sumValue')
      .where('samples.seriesKey = :seriesKey', { seriesKey: dto.seriesKey })
      .andWhere('samples.recordedAt >= :startAt', { startAt: toDate(dto.startAt) })
      .andWhere('samples.recordedAt < :endAt', { endAt: toDate(dto.endAt) })
      .groupBy('bucketAt')
      .orderBy('bucketAt', 'ASC')
      .setParameter('bucket', dto.bucket);

    if (dto.metricName) {
      queryBuilder.andWhere('samples.metricName = :metricName', { metricName: dto.metricName });
    }

    const rawData = await queryBuilder.getRawMany();
    return {
      seriesKey: dto.seriesKey,
      metricName: dto.metricName,
      bucket: dto.bucket as TimeSeriesBucketEnum,
      startAt: dto.startAt,
      endAt: dto.endAt,
      items: rawData.map((item) => TimeSeriesSummaryItemPO.plainToClass({
        bucketAt: new Date(item.bucketAt).toISOString(),
        count: Number(item.count),
        minValue: Number(item.minValue),
        maxValue: Number(item.maxValue),
        avgValue: Number(item.avgValue),
        sumValue: Number(item.sumValue)
      }))
    };
  }

  async aggregateByDTO (
    dto: Pick<DownsampleTimeSeriesSamplesDTO, 'seriesKey' | 'metricName' | 'startAt' | 'endAt' | 'bucket'>
  ): Promise<Array<TimeSeriesSummaryItemPO & { metricName: string }>> {
    const queryBuilder = this.createQueryBuilder('samples')
      .select('samples.metricName', 'metricName')
      .addSelect(`date_trunc(:bucket, samples.recordedAt)`, 'bucketAt')
      .addSelect('COUNT(*)', 'count')
      .addSelect('MIN(samples.value)', 'minValue')
      .addSelect('MAX(samples.value)', 'maxValue')
      .addSelect('AVG(samples.value)', 'avgValue')
      .addSelect('SUM(samples.value)', 'sumValue')
      .where('samples.seriesKey = :seriesKey', { seriesKey: dto.seriesKey })
      .andWhere('samples.recordedAt >= :startAt', { startAt: toDate(dto.startAt) })
      .andWhere('samples.recordedAt < :endAt', { endAt: toDate(dto.endAt) })
      .groupBy('samples.metricName')
      .addGroupBy('bucketAt')
      .orderBy('bucketAt', 'ASC')
      .setParameter('bucket', dto.bucket);

    if (dto.metricName) {
      queryBuilder.andWhere('samples.metricName = :metricName', { metricName: dto.metricName });
    }

    const rawData = await queryBuilder.getRawMany();
    return rawData.map((item) => ({
      metricName: item.metricName,
      bucketAt: new Date(item.bucketAt).toISOString(),
      count: Number(item.count),
      minValue: Number(item.minValue),
      maxValue: Number(item.maxValue),
      avgValue: Number(item.avgValue),
      sumValue: Number(item.sumValue)
    }));
  }

  async deleteOlderThanByDTO (dto: PruneTimeSeriesSamplesDTO): Promise<number> {
    const result = await this.createQueryBuilder()
      .delete()
      .where(dto.seriesKey ? 'seriesKey = :seriesKey' : '1 = 1', { seriesKey: dto.seriesKey })
      .andWhere(dto.metricName ? 'metricName = :metricName' : '1 = 1', { metricName: dto.metricName })
      .andWhere('recordedAt < :olderThan', { olderThan: toDate(dto.olderThan) })
      .execute();

    return result.affected || 0;
  }
}
