/* Import Package */
import { Expose, plainToClass, Type } from 'class-transformer';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

/* Type & Interface */
import { PaginationAO } from '../../common/ao/pagination.ao';
import { TimeSeriesBucketEnum } from '../dto/time-series.controller.dto';

@ApiModel({
  description: 'Time series sample AO'
})
export class TimeSeriesSampleAO {
  @Expose()
  @ApiModelProperty({
    description: 'Sample id',
    example: 1
  })
  id: number;

  @Expose()
  @ApiModelProperty({
    description: 'Time series key',
    example: 'temperature.sensor-01'
  })
  seriesKey: string;

  @Expose()
  @ApiModelProperty({
    description: 'Metric name',
    example: 'temperature'
  })
  metricName: string;

  @Expose()
  @ApiModelProperty({
    description: 'Sample numeric value',
    example: 27.5
  })
  value: number;

  @Expose()
  @ApiModelProperty({
    description: 'Sample recorded time',
    example: '2026-07-10T08:00:00.000Z'
  })
  recordedAt: Date;

  @Expose()
  @ApiModelProperty({
    description: 'Free-form sample tags',
    example: { region: 'tw-north', device: 'sensor-01' }
  })
  tags: Record<string, unknown>;

  @Expose()
  @ApiModelProperty({
    description: 'Source system or collector',
    example: 'edge-gateway-1'
  })
  source?: string;

  static plainToClass (bo:any): TimeSeriesSampleAO {
    return plainToClass(TimeSeriesSampleAO, bo, {
      excludeExtraneousValues: true
    });
  }
}

export class TimeSeriesSamplesAO {
  @Expose()
  @Type(() => TimeSeriesSampleAO)
  @ApiModelProperty({
    description: 'Time series sample items',
    model: TimeSeriesSampleAO.name
  })
  items: TimeSeriesSampleAO[];

  @Expose()
  @Type(() => PaginationAO)
  @ApiModelProperty({
    description: 'Pagination information',
    model: PaginationAO.name
  })
  pagination: PaginationAO;

  static plainToClass (bo:any): TimeSeriesSamplesAO {
    return plainToClass(TimeSeriesSamplesAO, bo, {
      excludeExtraneousValues: true
    });
  }
}

@ApiModel({
  description: 'Time series summary item AO'
})
export class TimeSeriesSummaryItemAO {
  @Expose()
  @ApiModelProperty({
    description: 'Bucket start time',
    example: '2026-07-10T08:00:00.000Z'
  })
  bucketAt: string;

  @Expose()
  @ApiModelProperty({
    description: 'Aggregated sample count',
    example: 12
  })
  count: number;

  @Expose()
  @ApiModelProperty({
    description: 'Minimum sample value',
    example: 18.2
  })
  minValue: number;

  @Expose()
  @ApiModelProperty({
    description: 'Maximum sample value',
    example: 30.7
  })
  maxValue: number;

  @Expose()
  @ApiModelProperty({
    description: 'Average sample value',
    example: 25.4
  })
  avgValue: number;

  @Expose()
  @ApiModelProperty({
    description: 'Sum of sample values',
    example: 304.8
  })
  sumValue: number;

  static plainToClass (bo:any): TimeSeriesSummaryItemAO {
    return plainToClass(TimeSeriesSummaryItemAO, bo, {
      excludeExtraneousValues: true
    });
  }
}

@ApiModel({
  description: 'Time series summary AO'
})
export class TimeSeriesSummaryAO {
  @Expose()
  @ApiModelProperty({
    description: 'Time series key',
    example: 'temperature.sensor-01'
  })
  seriesKey: string;

  @Expose()
  @ApiModelProperty({
    description: 'Metric name',
    example: 'temperature'
  })
  metricName?: string;

  @Expose()
  @ApiModelProperty({
    description: 'Bucket granularity',
    enum: Object.values(TimeSeriesBucketEnum),
    example: TimeSeriesBucketEnum.HOUR
  })
  bucket: TimeSeriesBucketEnum;

  @Expose()
  @ApiModelProperty({
    description: 'Range start time',
    example: '2026-07-10T00:00:00.000Z'
  })
  startAt: string;

  @Expose()
  @ApiModelProperty({
    description: 'Range end time',
    example: '2026-07-11T00:00:00.000Z'
  })
  endAt: string;

  @Expose()
  @Type(() => TimeSeriesSummaryItemAO)
  @ApiModelProperty({
    description: 'Summary items',
    model: TimeSeriesSummaryItemAO.name
  })
  items: TimeSeriesSummaryItemAO[];

  static plainToClass (bo:any): TimeSeriesSummaryAO {
    return plainToClass(TimeSeriesSummaryAO, bo, {
      excludeExtraneousValues: true
    });
  }
}
