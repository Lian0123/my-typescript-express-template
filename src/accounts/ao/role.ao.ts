/* Import Package */
import { Expose, plainToClass, Type } from 'class-transformer';
import dayjs = require('dayjs');
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

/* Type & Interface */
import { PaginationAO } from '../../common/ao/pagination.ao';

/* Enum & Constant */
import { RoleNameEnum, RoleStatusEnum } from '../../common/enums';

@ApiModel({
  description: 'Role AO'
})
export class RoleAO {
    @Expose()
    @ApiModelProperty({
      description: 'Role Id',
      example: 1
    })
    id: number;

    @Expose()
    @ApiModelProperty({
      description: 'Role Name',
      example: RoleNameEnum.ADMIN
    })
    name: RoleNameEnum;

    @Expose()
    @ApiModelProperty({
      description: 'Role Id',
      enum: [RoleStatusEnum.DISABLE.toString(), RoleStatusEnum.ENABLE.toString(), RoleStatusEnum.INIT.toString()],
      example: RoleStatusEnum.INIT
    })
    status: RoleStatusEnum;

    @Expose()
    @ApiModelProperty({
      description: 'Role is unique for account',
      example: false
    })
    isUnique: boolean;

    @Expose()
    @ApiModelProperty({
      description: 'Role can assess start at',
      example:  dayjs()
    })
    assessStartAt: string;

    @Expose()
    @ApiModelProperty({
      description: 'Role can assess end at',
      example: dayjs().add(10,'day')
    })
    assessEndAt: string;

    @Expose()
    @ApiModelProperty({
      description: 'Role can apply count',
      example: 100
    })
    applyCount: number;

    @Expose()
    @ApiModelProperty({
        description: 'Role can apply total count',
        example: 3
    })
    totalCount: number;

    static plainToClass (bo:any): RoleAO {
      return plainToClass(RoleAO, bo, {
        excludeExtraneousValues: true
      });
    }
}

export class RolesAO {
    @Expose()
    @Type(() => RoleAO)
    @ApiModelProperty({
      description: 'Role Id',
      model: 'RoleAO'
    })
    items: RoleAO[];

    @Expose()
    @Type(() => PaginationAO)
    @ApiModelProperty({
      description: 'Role Id',
      model: 'PaginationAO'
    })
    pagination: PaginationAO;

    static plainToClass (bo:any): RolesAO {
      return plainToClass(RolesAO, bo, {
        excludeExtraneousValues: true
      });
    }
}


@ApiModel({
  description: 'Role RabbitMQ AO'
})
export class RoleRabbitMQAO extends RoleAO {
  @Expose()
  @ApiModelProperty({
    description: 'Data version number',
    example: 1,
  })
  version: number;

  static plainToClass (bo:any): RoleRabbitMQAO {
    return plainToClass(RoleRabbitMQAO, bo, {
      excludeExtraneousValues: true
    });
  }
}