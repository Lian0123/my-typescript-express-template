import { plainToClass, Transform, Type } from 'class-transformer';
import { AccountStatusEnum, GenderEnum } from '../../common/enums';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { PaginationDTO } from '../../common/dto/pagination.dto';

export class AccountParamDTO {
    @Transform(({ value }) => { return Number(value); })
    @ApiModelProperty({
      description: 'Account id',
      example: 1
    })
    id: number;

    static plainToClass (dto:any): AccountParamDTO {
      return plainToClass(AccountParamDTO, dto, {
        excludeExtraneousValues: true
      });
    }
}

@ApiModel({
  description: 'Update account body object description'
})
export class UpdateAccountBodyDTO {
    @ApiModelProperty({
      description: 'Account Name',
      example: 'josh'
    })
    name?: string;

    @ApiModelProperty({
      description: 'Account setting email',
      example: 'example@mail.com'
    })
    email?: string;

    @ApiModelProperty({
      description: 'account id',
      enum: [GenderEnum.FEMALE, GenderEnum.MALE],
      example: GenderEnum.MALE
    })
    gender?: GenderEnum;

    @ApiModelProperty({
      description: 'Account setting locate language',
      example: 'Japanese'
    })
    language?: string;

    @ApiModelProperty({
      description: 'Account setting area',
      example: 'Asia'
    })
    area?: string;

    @ApiModelProperty({
      description: 'Account setting country',
      example: 'Japan'
    })
    country?: string;

    @ApiModelProperty({
      description: 'Account roles',
      example: [1,2,3],
    })
    roles?: number[];

    @ApiModelProperty({
      description: 'Account roles',
      enum: Object.keys(AccountStatusEnum),
      example: AccountStatusEnum.ENABLE,
    })
    status?: AccountStatusEnum;

    static plainToClass (dto:any): UpdateAccountBodyDTO {
      return plainToClass(UpdateAccountBodyDTO, dto, {
        excludeExtraneousValues: true
      });
    }
}

@ApiModel({
  description: 'Create account body object description'
})
export class CreateAccountBodyDTO {
    @ApiModelProperty({
      description: 'account id',
      example: 'josh'
    })
    name: string;

    @ApiModelProperty({
      description: 'Account setting email',
      example: 'example@mail.com'
    })
    email: string;

    @ApiModelProperty({
      description: 'account id',
      enum: [GenderEnum.FEMALE, GenderEnum.MALE],
      example: GenderEnum.MALE
    })
    gender: GenderEnum;

    @ApiModelProperty({
      description: 'Account setting locate language',
      example: 'Japanese'
    })
    language: string;

    @ApiModelProperty({
      description: 'Account setting area',
      example: 'Asia'
    })
    area: string;

    @ApiModelProperty({
      description: 'Account setting country',
      example: 'Japan'
    })
    country: string;

    @ApiModelProperty({
      description: 'Account roles',
      example: [1,2,3],
    })
    roles: number[];

    @ApiModelProperty({
      description: 'Account roles',
      enum: Object.keys(AccountStatusEnum),
      example: AccountStatusEnum.ENABLE,
    })
    status: AccountStatusEnum;

}

export class FindAccountsQueryDTO extends PaginationDTO {}

export class CreateAccountsBodyDTO {
    @Type(() => CreateAccountBodyDTO)
    @ApiModelProperty({
      description: 'Account Id',
      model: 'CreateAccountBodyDTO'
    })
    items: CreateAccountBodyDTO[];

    static plainToClass (dto:any): CreateAccountsBodyDTO {
      return plainToClass(CreateAccountsBodyDTO, dto, {
        excludeExtraneousValues: true
      });
    }
}
