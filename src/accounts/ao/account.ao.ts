/* Import Package */
import { Expose, plainToClass, Type } from 'class-transformer';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

/* Type & Interface */
import { PaginationAO } from '../../common/ao/pagination.ao';

/* Enum & Constant */
import { GenderEnum } from '../../common/enums';

@ApiModel({
  description: 'Account AO'
})
export class AccountAO {
    @Expose()
    @ApiModelProperty({
      description: 'Account Id',
      example: 1
    })
    id: number;

    @Expose()
    @ApiModelProperty({
      description: 'Account Name',
      example: 'test'
    })
    name: string;

    @Expose()
    @ApiModelProperty({
      description: 'Account Id',
      enum: [GenderEnum.FEMALE, GenderEnum.MALE],
      example: GenderEnum.FEMALE
    })
    gender: GenderEnum;

    @Expose()
    @ApiModelProperty({
      description: 'Account Email',
      example: 'exampe@gmail.com'
    })
    email: string;

    @Expose()
    @ApiModelProperty({
      description: 'Account setting locate language',
      example: 'Japanese'
    })
    language: string;

    @Expose()
    @ApiModelProperty({
      description: 'Account setting area',
      example: 'Asia'
    })
    area: string;

    @Expose()
    @ApiModelProperty({
      description: 'Account setting country',
      example: 'japan'
    })
    country: string;

  @Expose()
    @ApiModelProperty({
      description: 'Account roles',
      example: [1,2,3]
    })
    roles: number[];

    static plainToClass (bo:any): AccountAO {
      return plainToClass(AccountAO, bo, {
        excludeExtraneousValues: true
      });
    }
}

export class AccountsAO {
    @Expose()
    @Type(() => AccountAO)
    @ApiModelProperty({
      description: 'Account Id',
      model: 'AccountAO'
    })
    items: AccountAO[];

    @Expose()
    @Type(() => PaginationAO)
    @ApiModelProperty({
      description: 'Account Id',
      model: 'PaginationAO'
    })
    pagination: PaginationAO;

    static plainToClass (bo:any): AccountsAO {
      return plainToClass(AccountsAO, bo, {
        excludeExtraneousValues: true
      });
    }
}

@ApiModel({
  description: 'Account RabbitMQ AO'
})
export class AccountRabbitMQAO extends AccountAO {
  @Expose()
  @ApiModelProperty({
    description: 'Data version number',
    example: 1,
  })
  version: number;

  static plainToClass (bo:any): AccountRabbitMQAO {
    return plainToClass(AccountRabbitMQAO, bo, {
      excludeExtraneousValues: true
    });
  }
}