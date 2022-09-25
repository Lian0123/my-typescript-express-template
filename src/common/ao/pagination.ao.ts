import { Expose, Transform } from 'class-transformer';
import { IsPositive } from 'class-validator';
import { ApiModelProperty } from 'swagger-express-ts';

export class PaginationAO {
    @Expose()
    @IsPositive()
    @Transform(({ value }) => Number(value))
    @ApiModelProperty({
      description: 'Pagination query limit',
      example: 30
    })
    limit: number;

    @Expose()
    @IsPositive()
    @Transform(({ value }) => Number(value))
    @ApiModelProperty({
      description: 'Pagination query offset',
      example: 0
    })
    offset: number;

    @Expose()
    @IsPositive()
    @Transform(({ value }) => Number(value))
    @ApiModelProperty({
      description: 'Pagination items total count',
      example: 1
    })
    totalCount: number;
}