import { plainToClass, Transform, Type } from 'class-transformer'
import { PaginationDTO } from '../../common/dto/pagination.dto'
import { ApiModel, ApiModelProperty } from 'swagger-express-ts'
import { GenderEnum } from '../enums/gender.enum'

export class UserParamDTO {
    @Transform(({ value }) => { return Number(value) })
    @ApiModelProperty({
      description: 'account id',
      example: 1
    })
    id: number;

    static plainToClass (dto:any): UserParamDTO {
      return plainToClass(UserParamDTO, dto, {
        excludeExtraneousValues: true
      })
    }
}

@ApiModel({
  description: 'Update user body object description'
})
export class UpdateUserBodyDTO {
    @ApiModelProperty({
      description: 'account id',
      example: 1
    })
    name?: string;

    @ApiModelProperty({
      description: 'account id',
      enum: [GenderEnum.FEMALE, GenderEnum.MALE],
      example: GenderEnum.MALE
    })
    gender?: GenderEnum;

    static plainToClass (dto:any): UpdateUserBodyDTO {
      return plainToClass(UpdateUserBodyDTO, dto, {
        excludeExtraneousValues: true
      })
    }
}

@ApiModel({
  description: 'Create user body object description'
})
export class CreateUserBodyDTO {
    @ApiModelProperty({
      description: 'account id',
      example: 'josh'
    })
    name: string;

    @ApiModelProperty({
      description: 'account id',
      enum: [GenderEnum.FEMALE, GenderEnum.MALE],
      example: GenderEnum.MALE
    })
    gender: GenderEnum;
}

export class FindUsersQueryDTO extends PaginationDTO {}

export class CreateUsersBodyDTO {
    @Type(() => CreateUserBodyDTO)
    @ApiModelProperty({
      description: 'User Id',
      model: 'CreateUserBodyDTO'
    })
    items: CreateUserBodyDTO[];

    static plainToClass (dto:any): CreateUsersBodyDTO {
      return plainToClass(CreateUsersBodyDTO, dto, {
        excludeExtraneousValues: true
      })
    }
}
