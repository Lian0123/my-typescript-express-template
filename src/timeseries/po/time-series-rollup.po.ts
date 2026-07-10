/* Import Package */
import { Expose, plainToClass } from 'class-transformer';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'Time series rollup PO'
})
export class TimeSeriesRollupPO {
  @Expose()
  @ApiModelProperty({ description: 'Rollup id', example: 1 })
  id: number;

  @Expose()
  @ApiModelProperty({ description: 'Time series key', example: 'temperature.sensor-01' })
  seriesKey: string;

  @Expose()
  @ApiModelProperty({ description: 'Metric name', example: 'temperature' })
  metricName: string;

  @Expose()
  @ApiModelProperty({ description: 'Bucket granularity', example: 'hour' })
  bucket: string;

  @Expose()
  @ApiModelProperty({ description: 'Bucket time', example: '2026-07-10T08:00:00.000Z' })
  bucketAt: Date;

  @Expose()
  @ApiModelProperty({ description: 'Sample count', example: 12 })
  count: number;

  @Expose()
  @ApiModelProperty({ description: 'Minimum value', example: 18.2 })
  minValue: number;

  @Expose()
  @ApiModelProperty({ description: 'Maximum value', example: 30.7 })
  maxValue: number;

  @Expose()
  @ApiModelProperty({ description: 'Average value', example: 25.4 })
  avgValue: number;

  @Expose()
  @ApiModelProperty({ description: 'Sum value', example: 304.8 })
  sumValue: number;

  static plainToClass (entity:any): TimeSeriesRollupPO {
    return plainToClass(TimeSeriesRollupPO, entity, {
      excludeExtraneousValues: true
    });
  }
}
