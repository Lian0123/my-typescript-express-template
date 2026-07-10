/* Import Package */
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

/* Type & Interface */
import { FindTimeSeriesSummaryQueryDTO } from './time-series.controller.dto';

export class DownsampleTimeSeriesSamplesBodyDTO extends FindTimeSeriesSummaryQueryDTO {
  @ApiModelProperty({
    description: 'Replace existing rollup rows in the same range before insert',
    example: true,
    required: false
  })
  @Transform(({ value }) => value === undefined ? true : value === true || value === 'true' || value === 1 || value === '1')
  @IsBoolean()
  replaceExisting = true;
}

@ApiModel({
  description: 'Prune time series samples body object description'
})
export class PruneTimeSeriesSamplesBodyDTO {
  @ApiModelProperty({
    description: 'Time series key',
    example: 'temperature.sensor-01',
    required: false
  })
  @IsString()
  @IsOptional()
  seriesKey?: string;

  @ApiModelProperty({
    description: 'Metric name',
    example: 'temperature',
    required: false
  })
  @IsString()
  @IsOptional()
  metricName?: string;

  @ApiModelProperty({
    description: 'Delete samples older than this ISO time',
    example: '2026-06-10T00:00:00.000Z'
  })
  @IsDateString()
  @IsString()
  @Transform(({ value }) => String(value))
  olderThan: string;

  @ApiModelProperty({
    description: 'Also delete rollup rows older than the same cutoff',
    example: true,
    required: false
  })
  @Transform(({ value }) => value === undefined ? false : value === true || value === 'true' || value === 1 || value === '1')
  @IsBoolean()
  pruneRollups = false;
}
