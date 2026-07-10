/* Import Package */
import { inject, injectable } from 'inversify';

/* Error */
import { ErrorMessageEnum, serviceError } from '../common/constants';

/* Repository */
import { TimeSeriesSampleRepository } from './repositories/time-series.repository';

/* DTO */
import {
  CreateManyTimeSeriesSamplesDTO,
  CreateOneTimeSeriesSampleDTO,
  FindManyTimeSeriesSamplesDTO,
  FindManyTimeSeriesSummaryDTO
} from './dto/time-series.repository.dto';
import {
  DownsampleTimeSeriesSamplesDTO,
  PruneTimeSeriesSamplesDTO
} from './dto/time-series.maintenance.repository.dto';

/* BO */
import { TimeSeriesSampleBO, TimeSeriesSamplesBO, TimeSeriesSummaryBO } from './bo/time-series.bo';
import { TimeSeriesMaintenanceResultBO } from './bo/time-series.maintenance.bo';

/* Rollup Repository */
import { TimeSeriesRollupRepository } from './repositories/time-series-rollup.repository';

const ensureTimeSeriesRange = (startAt: string, endAt: string): void => {
  const start = new Date(startAt);
  const end = new Date(endAt);

  if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf()) || start >= end) {
    throw serviceError(ErrorMessageEnum.TEMPLATE_TIME_SERIES_RANGE_INVALID);
  }
};

@injectable()
export class V1TimeSeriesService {
  constructor (
    @inject(TimeSeriesSampleRepository.name) private timeSeriesSampleRepository: TimeSeriesSampleRepository,
    @inject(TimeSeriesRollupRepository.name) private timeSeriesRollupRepository: TimeSeriesRollupRepository
  ) {}

  async createOneTimeSeriesSampleByDTO (dto: CreateOneTimeSeriesSampleDTO): Promise<TimeSeriesSampleBO> {
    return TimeSeriesSampleBO.plainToClass(
      await this.timeSeriesSampleRepository.createOneByDTO(dto)
    );
  }

  async createManyTimeSeriesSamplesByDTO (dto: CreateManyTimeSeriesSamplesDTO): Promise<TimeSeriesSampleBO[]> {
    const samples = await this.timeSeriesSampleRepository.createManyByDTO(dto);
    return samples.map((sample) => TimeSeriesSampleBO.plainToClass(sample));
  }

  async findManyTimeSeriesSamplesByDTO (dto: FindManyTimeSeriesSamplesDTO): Promise<TimeSeriesSamplesBO> {
    ensureTimeSeriesRange(dto.startAt, dto.endAt);

    return TimeSeriesSamplesBO.plainToClass(
      await this.timeSeriesSampleRepository.findManyByDTO(dto)
    );
  }

  async summarizeTimeSeriesSamplesByDTO (dto: FindManyTimeSeriesSummaryDTO): Promise<TimeSeriesSummaryBO> {
    ensureTimeSeriesRange(dto.startAt, dto.endAt);

    return TimeSeriesSummaryBO.plainToClass(
      await this.timeSeriesSampleRepository.summarizeByDTO(dto)
    );
  }

  async downsampleTimeSeriesSamplesByDTO (dto: DownsampleTimeSeriesSamplesDTO): Promise<TimeSeriesMaintenanceResultBO> {
    ensureTimeSeriesRange(dto.startAt, dto.endAt);
    const rollupItems = await this.timeSeriesSampleRepository.aggregateByDTO(dto);
    const rollupData = await this.timeSeriesRollupRepository.replaceManyByDTO(dto, rollupItems);

    return TimeSeriesMaintenanceResultBO.plainToClass({
      downsampledCount: rollupData.items.length,
      replacedCount: rollupData.replacedCount,
      deletedRawCount: 0,
      deletedRollupCount: 0
    });
  }

  async pruneTimeSeriesSamplesByDTO (dto: PruneTimeSeriesSamplesDTO): Promise<TimeSeriesMaintenanceResultBO> {
    const deletedRawCount = await this.timeSeriesSampleRepository.deleteOlderThanByDTO(dto);
    const deletedRollupCount = dto.pruneRollups
      ? await this.timeSeriesRollupRepository.deleteOlderThanByDTO(dto)
      : 0;

    return TimeSeriesMaintenanceResultBO.plainToClass({
      downsampledCount: 0,
      replacedCount: 0,
      deletedRawCount,
      deletedRollupCount
    });
  }
}
