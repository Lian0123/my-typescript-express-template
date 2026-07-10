/* Import Package */
import { Request } from 'express';
import { inject } from 'inversify';
import {
  interfaces,
  controller,
  httpGet,
  httpPost
} from 'inversify-express-utils';
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant
} from 'swagger-express-ts';

/* Enum & Constant */
import { CreateResponses } from '../common/constants';

/* Service Layer */
import { V1TimeSeriesService } from './time-series.service';

/* DTO */
import {
  CreateTimeSeriesSampleBodyDTO,
  CreateTimeSeriesSamplesBodyDTO,
  FindTimeSeriesSamplesQueryDTO,
  FindTimeSeriesSummaryQueryDTO
} from './dto/time-series.controller.dto';

/* AO */
import { TimeSeriesSampleAO, TimeSeriesSamplesAO, TimeSeriesSummaryAO } from './ao/time-series.ao';
import { TimeSeriesMaintenanceResultAO } from './ao/time-series.maintenance.ao';

/* DTO */
import {
  DownsampleTimeSeriesSamplesBodyDTO,
  PruneTimeSeriesSamplesBodyDTO
} from './dto/time-series.maintenance.controller.dto';

/* Utils */
import { validateClass } from '../utils';

/* Inject Reference */
import 'reflect-metadata';

@ApiPath({
  name: '/v1/time-series',
  path: '/v1/time-series'
})
@controller('/v1/time-series')
export class V1TimeSeriesController implements interfaces.Controller {
  public static TARGET_NAME = 'v1_time_series_controller';

  constructor (
    @inject(V1TimeSeriesService.name) private timeSeriesService: V1TimeSeriesService
  ) {}

  @httpPost('/samples')
  @ApiOperationPost({
    summary: 'Ingest one time series sample',
    description: 'Ingest one time series sample',
    path: '/samples',
    parameters: {
      body: {
        required: true,
        model: CreateTimeSeriesSampleBodyDTO.name
      }
    },
    responses: CreateResponses
  })
  async createTimeSeriesSampleByDTO (
    request: Request
  ): Promise<TimeSeriesSampleAO> {
    const bodyDTO = await validateClass(CreateTimeSeriesSampleBodyDTO, request.body);

    return TimeSeriesSampleAO.plainToClass(
      await this.timeSeriesService.createOneTimeSeriesSampleByDTO(bodyDTO)
    );
  }

  @httpPost('/samples/batch')
  @ApiOperationPost({
    summary: 'Ingest many time series samples',
    description: 'Ingest many time series samples',
    path: '/samples/batch',
    parameters: {
      body: {
        required: true,
        model: CreateTimeSeriesSamplesBodyDTO.name
      }
    },
    responses: CreateResponses
  })
  async createTimeSeriesSamplesByDTO (
    request: Request
  ): Promise<TimeSeriesSampleAO[]> {
    const bodyDTO = await validateClass(CreateTimeSeriesSamplesBodyDTO, request.body);

    return (await this.timeSeriesService.createManyTimeSeriesSamplesByDTO(bodyDTO))
      .map((item) => TimeSeriesSampleAO.plainToClass(item));
  }

  @httpGet('/samples')
  @ApiOperationGet({
    summary: 'Query time series samples by range',
    description: 'Query time series samples by range',
    path: '/samples',
    parameters: {
      query: {
        seriesKey: {
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
          description: 'Time series key',
          default: 'temperature.sensor-01' as any
        },
        metricName: {
          required: false,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
          description: 'Metric name',
          default: 'temperature' as any
        },
        startAt: {
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
          description: 'Range start time in ISO 8601',
          default: '2026-07-10T00:00:00.000Z' as any
        },
        endAt: {
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
          description: 'Range end time in ISO 8601',
          default: '2026-07-11T00:00:00.000Z' as any
        },
        limit: {
          required: false,
          type: SwaggerDefinitionConstant.Parameter.Type.NUMBER,
          description: 'Query row limit',
          default: 1000
        },
        offset: {
          required: false,
          type: SwaggerDefinitionConstant.Parameter.Type.NUMBER,
          description: 'Query row offset',
          default: 0
        }
      }
    },
    responses: {
      200: {
        description: 'OK',
        model: TimeSeriesSamplesAO.name
      },
      400: {
        description: 'Bad Request'
      }
    }
  })
  async findTimeSeriesSamplesByDTO (
    request: Request
  ): Promise<TimeSeriesSamplesAO> {
    const queryDTO = await validateClass(FindTimeSeriesSamplesQueryDTO, request.query);

    return TimeSeriesSamplesAO.plainToClass(
      await this.timeSeriesService.findManyTimeSeriesSamplesByDTO(queryDTO)
    );
  }

  @httpGet('/summary')
  @ApiOperationGet({
    summary: 'Summarize time series samples by bucket',
    description: 'Summarize time series samples by bucket',
    path: '/summary',
    parameters: {
      query: {
        seriesKey: {
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
          description: 'Time series key',
          default: 'temperature.sensor-01' as any
        },
        metricName: {
          required: false,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
          description: 'Metric name',
          default: 'temperature' as any
        },
        startAt: {
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
          description: 'Range start time in ISO 8601',
          default: '2026-07-10T00:00:00.000Z' as any
        },
        endAt: {
          required: true,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
          description: 'Range end time in ISO 8601',
          default: '2026-07-11T00:00:00.000Z' as any
        },
        bucket: {
          required: false,
          type: SwaggerDefinitionConstant.Parameter.Type.STRING,
          description: 'Bucket granularity',
          default: 'hour' as any
        }
      }
    },
    responses: {
      200: {
        description: 'OK',
        model: TimeSeriesSummaryAO.name
      },
      400: {
        description: 'Bad Request'
      }
    }
  })
  async summarizeTimeSeriesSamplesByDTO (
    request: Request
  ): Promise<TimeSeriesSummaryAO> {
    const queryDTO = await validateClass(FindTimeSeriesSummaryQueryDTO, request.query);

    return TimeSeriesSummaryAO.plainToClass(
      await this.timeSeriesService.summarizeTimeSeriesSamplesByDTO(queryDTO)
    );
  }

  @httpPost('/maintenance/downsample')
  @ApiOperationPost({
    summary: 'Downsample time series samples into rollups',
    description: 'Downsample time series samples into rollups',
    path: '/maintenance/downsample',
    parameters: {
      body: {
        required: true,
        model: DownsampleTimeSeriesSamplesBodyDTO.name
      }
    },
    responses: {
      200: {
        description: 'OK',
        model: TimeSeriesMaintenanceResultAO.name
      },
      400: {
        description: 'Bad Request'
      }
    }
  })
  async downsampleTimeSeriesSamplesByDTO (
    request: Request
  ): Promise<TimeSeriesMaintenanceResultAO> {
    const bodyDTO = await validateClass(DownsampleTimeSeriesSamplesBodyDTO, request.body);

    return TimeSeriesMaintenanceResultAO.plainToClass(
      await this.timeSeriesService.downsampleTimeSeriesSamplesByDTO(bodyDTO)
    );
  }

  @httpPost('/maintenance/retention')
  @ApiOperationPost({
    summary: 'Prune old time series samples',
    description: 'Prune old time series samples',
    path: '/maintenance/retention',
    parameters: {
      body: {
        required: true,
        model: PruneTimeSeriesSamplesBodyDTO.name
      }
    },
    responses: {
      200: {
        description: 'OK',
        model: TimeSeriesMaintenanceResultAO.name
      },
      400: {
        description: 'Bad Request'
      }
    }
  })
  async pruneTimeSeriesSamplesByDTO (
    request: Request
  ): Promise<TimeSeriesMaintenanceResultAO> {
    const bodyDTO = await validateClass(PruneTimeSeriesSamplesBodyDTO, request.body);

    return TimeSeriesMaintenanceResultAO.plainToClass(
      await this.timeSeriesService.pruneTimeSeriesSamplesByDTO(bodyDTO)
    );
  }
}
