/* Import Package */
import { Expose, plainToClass } from 'class-transformer';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  description: 'Time series maintenance result AO'
})
export class TimeSeriesMaintenanceResultAO {
  @Expose()
  @ApiModelProperty({ description: 'Inserted rollup rows', example: 24 })
  downsampledCount: number;

  @Expose()
  @ApiModelProperty({ description: 'Replaced rollup rows', example: 24 })
  replacedCount: number;

  @Expose()
  @ApiModelProperty({ description: 'Deleted raw sample rows', example: 1000 })
  deletedRawCount: number;

  @Expose()
  @ApiModelProperty({ description: 'Deleted rollup rows', example: 200 })
  deletedRollupCount: number;

  static plainToClass (bo:any): TimeSeriesMaintenanceResultAO {
    return plainToClass(TimeSeriesMaintenanceResultAO, bo, {
      excludeExtraneousValues: true
    });
  }
}
