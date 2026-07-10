/* Import Package */
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested
} from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

/* Constant */
import { TIME_SERIES_DEFAULT_LIMIT, TIME_SERIES_MAX_LIMIT } from '../constants/time-series.constant';

export enum TimeSeriesBucketEnum {
  MINUTE = 'minute',
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

@ApiModel({
  description: 'Create time series sample body object description'
})
export class CreateTimeSeriesSampleBodyDTO {
  @ApiModelProperty({
    description: 'Time series key',
    example: 'temperature.sensor-01'
  })
  @IsString()
  @IsNotEmpty()
  seriesKey: string;

  @ApiModelProperty({
    description: 'Metric name',
    example: 'temperature'
  })
  @IsString()
  @IsNotEmpty()
  metricName: string;

  @ApiModelProperty({
    description: 'Sample numeric value',
    example: 27.5
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  value: number;

  @ApiModelProperty({
    description: 'Sample recorded time in ISO 8601 format',
    example: '2026-07-10T08:00:00.000Z'
  })
  @IsDateString()
  @IsOptional()
  recordedAt?: string;

  @ApiModelProperty({
    description: 'Free-form sample tags',
    example: { region: 'tw-north', device: 'sensor-01' }
  })
  @IsObject()
  @IsOptional()
  tags?: Record<string, unknown>;

  @ApiModelProperty({
    description: 'Source system or collector',
    example: 'edge-gateway-1'
  })
  @IsString()
  @IsOptional()
  source?: string;
}

@ApiModel({
  description: 'Create many time series samples body object description'
})
export class CreateTimeSeriesSamplesBodyDTO {
  @ApiModelProperty({
    description: 'Time series sample collection',
    model: CreateTimeSeriesSampleBodyDTO.name
  })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CreateTimeSeriesSampleBodyDTO)
  @ValidateNested({ each: true })
  items: CreateTimeSeriesSampleBodyDTO[];
}

@ApiModel({
  description: 'Find time series samples query object description'
})
export class FindTimeSeriesSamplesQueryDTO {
  @ApiModelProperty({
    description: 'Time series key',
    example: 'temperature.sensor-01'
  })
  @IsString()
  @IsNotEmpty()
  seriesKey: string;

  @ApiModelProperty({
    description: 'Metric name',
    example: 'temperature',
    required: false
  })
  @IsString()
  @IsOptional()
  metricName?: string;

  @ApiModelProperty({
    description: 'Range start in ISO 8601 format',
    example: '2026-07-10T00:00:00.000Z'
  })
  @IsDateString()
  startAt: string;

  @ApiModelProperty({
    description: 'Range end in ISO 8601 format',
    example: '2026-07-11T00:00:00.000Z'
  })
  @IsDateString()
  endAt: string;

  @ApiModelProperty({
    description: 'Query row limit',
    example: TIME_SERIES_DEFAULT_LIMIT,
    required: false
  })
  @Transform(({ value }) => value === undefined ? TIME_SERIES_DEFAULT_LIMIT : Number(value))
  @IsNumber()
  @Min(1)
  @Max(TIME_SERIES_MAX_LIMIT)
  limit = TIME_SERIES_DEFAULT_LIMIT;

  @ApiModelProperty({
    description: 'Query row offset',
    example: 0,
    required: false
  })
  @Transform(({ value }) => value === undefined ? 0 : Number(value))
  @IsNumber()
  @Min(0)
  offset = 0;
}

@ApiModel({
  description: 'Find time series summary query object description'
})
export class FindTimeSeriesSummaryQueryDTO extends FindTimeSeriesSamplesQueryDTO {
  @ApiModelProperty({
    description: 'Bucket granularity for summary',
    enum: Object.values(TimeSeriesBucketEnum),
    example: TimeSeriesBucketEnum.HOUR
  })
  @IsEnum(TimeSeriesBucketEnum)
  bucket: TimeSeriesBucketEnum = TimeSeriesBucketEnum.HOUR;
}
