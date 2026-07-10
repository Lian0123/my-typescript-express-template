/* Import Package */
import { decorate, injectable } from 'inversify';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

/* Entity */
import { TimeSeriesRollupEntity } from '../entities/time-series-rollup.entity';

/* DTO */
import { DownsampleTimeSeriesSamplesDTO, PruneTimeSeriesSamplesDTO } from '../dto/time-series.maintenance.repository.dto';

/* PO */
import { TimeSeriesRollupPO } from '../po/time-series-rollup.po';
import { TimeSeriesSummaryItemPO } from '../po/time-series.po';

/* Inject Reference */
import 'reflect-metadata';

decorate(injectable(), TimeSeriesRollupEntity);

const normalizeRollup = (
  item: TimeSeriesSummaryItemPO & { metricName: string },
  dto: DownsampleTimeSeriesSamplesDTO
): Partial<TimeSeriesRollupEntity> => ({
  seriesKey: dto.seriesKey,
  metricName: item.metricName,
  bucket: dto.bucket,
  bucketAt: new Date(item.bucketAt),
  count: item.count,
  minValue: item.minValue,
  maxValue: item.maxValue,
  avgValue: item.avgValue,
  sumValue: item.sumValue
});

@injectable()
@EntityRepository(TimeSeriesRollupEntity)
export class TimeSeriesRollupRepository extends BaseRepository<TimeSeriesRollupEntity> {
  async replaceManyByDTO (
    dto: DownsampleTimeSeriesSamplesDTO,
    items: Array<TimeSeriesSummaryItemPO & { metricName: string }>
  ): Promise<{ items: TimeSeriesRollupPO[]; replacedCount: number }> {
    let replacedCount = 0;

    if (dto.replaceExisting) {
      const result = await this.createQueryBuilder()
        .delete()
        .where('seriesKey = :seriesKey', { seriesKey: dto.seriesKey })
        .andWhere(dto.metricName ? 'metricName = :metricName' : '1 = 1', { metricName: dto.metricName })
        .andWhere('bucket = :bucket', { bucket: dto.bucket })
        .andWhere('bucketAt >= :startAt', { startAt: dto.startAt })
        .andWhere('bucketAt < :endAt', { endAt: dto.endAt })
        .execute();
      replacedCount = result.affected || 0;
    }

    const rawData = await this.save(items.map((item) => normalizeRollup(item, dto)));
    return {
      items: rawData.map((item) => TimeSeriesRollupPO.plainToClass(item)),
      replacedCount
    };
  }

  async deleteOlderThanByDTO (dto: PruneTimeSeriesSamplesDTO): Promise<number> {
    const rawResult = await this.createQueryBuilder()
      .delete()
      .where(dto.seriesKey ? 'seriesKey = :seriesKey' : '1 = 1', { seriesKey: dto.seriesKey })
      .andWhere(dto.metricName ? 'metricName = :metricName' : '1 = 1', { metricName: dto.metricName })
      .andWhere('bucketAt < :olderThan', { olderThan: dto.olderThan })
      .execute();

    return rawResult.affected || 0;
  }
}
