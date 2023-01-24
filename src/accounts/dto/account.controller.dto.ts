/* Import Package */
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

/* Type & Interface */
import { PaginationDTO } from '../../common/dto/pagination.dto';

/* Enum & Constant */
import { AccountStatusEnum, GenderEnum } from '../../common/enums';

export class AccountParamDTO {
    @Transform(({ value }) => { return Number(value)||value; })
    @ApiModelProperty({
      description: 'Account id',
      example: 1
    })
    @IsNumber()
    id: number;
}

@ApiModel({
  description: 'Update account body object description'
})
export class UpdateAccountBodyDTO {
    @ApiModelProperty({
      description: 'Account Name',
      example: 'josh'
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiModelProperty({
      description: 'Account setting email',
      example: 'example@mail.com'
    })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiModelProperty({
      description: 'account id',
      enum: [GenderEnum.FEMALE, GenderEnum.MALE],
      example: GenderEnum.MALE
    })
    @IsEnum(GenderEnum)
    @IsOptional()
    gender?: GenderEnum;

    @ApiModelProperty({
      description: 'Account setting locate language',
      example: 'Japanese'
    })
    @IsString()
    @IsOptional()
    language?: string;

    @ApiModelProperty({
      description: 'Account setting area',
      example: 'Asia'
    })
    @IsString()
    @IsOptional()
    area?: string;

    @ApiModelProperty({
      description: 'Account setting country',
      example: 'Japan'
    })
    @IsString()
    @IsOptional()
    country?: string;

    @ApiModelProperty({
      description: 'Account roles',
      enum: Object.keys(AccountStatusEnum),
      example: AccountStatusEnum.ENABLE,
    })
    @IsEnum(AccountStatusEnum)
    @IsOptional()
    status?: AccountStatusEnum;
}

@ApiModel({
  description: 'Create account body object description'
})
export class CreateAccountBodyDTO {
    @ApiModelProperty({
      description: 'account id',
      example: 'josh'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiModelProperty({
      description: 'Account setting email',
      example: 'example@mail.com'
    })
    @IsEmail()
    email: string;

    @ApiModelProperty({
      description: 'account id',
      enum: [GenderEnum.FEMALE, GenderEnum.MALE],
      example: GenderEnum.MALE
    })
    @IsEnum(GenderEnum, {})
    gender: GenderEnum;

    @ApiModelProperty({
      description: 'Account setting locate language',
      example: 'Japanese'
    })
    @IsString()
    language: string;

    @ApiModelProperty({
      description: 'Account setting area',
      example: 'Asia'
    })
    @IsString()
    area: string;

    @ApiModelProperty({
      description: 'Account setting country',
      example: 'Japan'
    })
    @IsString()
    country: string;

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
    @IsArray()
    items: CreateAccountBodyDTO[];
}

export class UpdateAccountRoleBodyDTO {
  @Transform(({ value }) => value ? Array.from(new Set(value)) : undefined )
  @IsArray()
  @ApiModelProperty({
    description: 'Account roles',
    example: [1,2,3],
  })
  roles: number[]; 
}