import { GenderEnum } from '../enums/gender.enum'
import { Expose, plainToClass, Type } from 'class-transformer'
import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import { PaginationAO } from '../../common/ao/pagination.ao'

@ApiModel({
  description: 'User AO '
})
export class UserAO {
    @Expose()
    @ApiModelProperty({
      description: 'User Id',
      example: 1
    })
    id: number;

    @Expose()
    @ApiModelProperty({
      description: 'User Id',
      example: 'test'
    })
    name: string;

    @Expose()
    @ApiModelProperty({
      description: 'User Id',
      enum: [GenderEnum.FEMALE, GenderEnum.MALE],
      example: GenderEnum.FEMALE
    })
    gender: GenderEnum;

    static plainToClass (bo:any): UserAO {
      return plainToClass(UserAO, bo, {
        excludeExtraneousValues: true
      })
    }
}

export class UsersAO {
    @Expose()
    @Type(() => UserAO)
    @ApiModelProperty({
      description: 'User Id',
      model: 'UserAO'
    })
    items: UserAO[];

    @Expose()
    @Type(() => PaginationAO)
    @ApiModelProperty({
      description: 'User Id',
      model: 'PaginationAO'
    })
    Pagination: PaginationAO;

    static plainToClass (bo:any): UsersAO {
      return plainToClass(UsersAO, bo, {
        excludeExtraneousValues: true
      })
    }
}
