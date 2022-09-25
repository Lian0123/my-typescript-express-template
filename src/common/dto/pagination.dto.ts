/* Import Package */
import { Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

/* Environment Variables */
const {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
} = process.env;

@ApiModel({
  description: 'Pagination page limit and offset'
})
export class PaginationDTO {
    @Expose()
    @IsOptional()
    @Transform(({ value }) => isNaN(parseInt(value)) ? parseInt(DEFAULT_PAGINATION_LIMIT) : parseInt(value))
    @ApiModelProperty({
      description: 'Pagination page limit',
      example: parseInt(DEFAULT_PAGINATION_LIMIT)
    })
    limit?: number;

    @Expose()
    @IsOptional()
    @Transform(({ value }) => isNaN(parseInt(value)) ? parseInt(DEFAULT_PAGINATION_OFFSET) : parseInt(value))
    @ApiModelProperty({
      description: 'Pagination page offset',
      example: parseInt(DEFAULT_PAGINATION_OFFSET)
    })
    offset?: number;
}
