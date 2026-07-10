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

/* BO */
import { TimeSeriesSampleBO, TimeSeriesSamplesBO, TimeSeriesSummaryBO } from './bo/time-series.bo';

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
    @inject(TimeSeriesSampleRepository.name) private timeSeriesSampleRepository: TimeSeriesSampleRepository
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
}
