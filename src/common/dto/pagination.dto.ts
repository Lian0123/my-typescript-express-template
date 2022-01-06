import { Expose, Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { ApiModel, ApiModelProperty } from 'swagger-express-ts'

@ApiModel({
  description: 'Pagination page limit and offset'
})
export class PaginationDTO {
    @Expose()
    @IsOptional()
    @Transform(({ value }) => isNaN(parseInt(value)) ? parseInt(process.env.DEFAULT_PAGINATION_LIMIT) : parseInt(value))
    @ApiModelProperty({
      description: 'Pagination page limit',
      example: parseInt(process.env.DEFAULT_PAGINATION_LIMIT)
    })
    limit?: number;

    @Expose()
    @IsOptional()
    @Transform(({ value }) => isNaN(parseInt(value)) ? parseInt(process.env.DEFAULT_PAGINATION_OFFSET) : parseInt(value))
    @ApiModelProperty({
      description: 'Pagination page offset',
      example: parseInt(process.env.DEFAULT_PAGINATION_OFFSET)
    })
    offset?: number;
}
