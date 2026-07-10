/* Import Package */
import { Expose, plainToClass, Type } from 'class-transformer';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

/* Type & Interface */
import { PaginationPO } from '../../common/po/pagination.po';
import { TimeSeriesBucketEnum } from '../dto/time-series.controller.dto';

@ApiModel({
  description: 'Time series sample PO'
})
export class TimeSeriesSamplePO {
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

  static plainToClass (entity:any): TimeSeriesSamplePO {
    return plainToClass(TimeSeriesSamplePO, entity, {
      excludeExtraneousValues: true
    });
  }
}

export class TimeSeriesSamplesPO {
  @Expose()
  @Type(() => TimeSeriesSamplePO)
  @ApiModelProperty({
    description: 'Time series sample items',
    model: TimeSeriesSamplePO.name
  })
  items: TimeSeriesSamplePO[];

  @Expose()
  @Type(() => PaginationPO)
  @ApiModelProperty({
    description: 'Pagination information',
    model: PaginationPO.name
  })
  pagination: PaginationPO;

  static plainToClass (entity:any): TimeSeriesSamplesPO {
    return plainToClass(TimeSeriesSamplesPO, entity, {
      excludeExtraneousValues: true
    });
  }
}

@ApiModel({
  description: 'Time series summary item PO'
})
export class TimeSeriesSummaryItemPO {
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

  static plainToClass (entity:any): TimeSeriesSummaryItemPO {
    return plainToClass(TimeSeriesSummaryItemPO, entity, {
      excludeExtraneousValues: true
    });
  }
}

@ApiModel({
  description: 'Time series summary PO'
})
export class TimeSeriesSummaryPO {
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
  @Type(() => TimeSeriesSummaryItemPO)
  @ApiModelProperty({
    description: 'Summary items',
    model: TimeSeriesSummaryItemPO.name
  })
  items: TimeSeriesSummaryItemPO[];

  static plainToClass (entity:any): TimeSeriesSummaryPO {
    return plainToClass(TimeSeriesSummaryPO, entity, {
      excludeExtraneousValues: true
    });
  }
}
