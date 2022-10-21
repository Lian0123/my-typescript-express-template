/* Import Package */
import { plainToClass, Transform, Type } from 'class-transformer';
import { getDateTime } from '../../utils';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

/* Type & Interface */
import { PaginationDTO } from '../../common/dto/pagination.dto';

/* Enum & Constant */
import { RoleNameEnum, RoleStatusEnum } from '../../common/enums';

export class RoleParamDTO {
    @Transform(({ value }) => { return Number(value); })
    @ApiModelProperty({
      description: 'Role id',
      example: 1
    })
    id: number;

    static plainToClass (dto:any): RoleParamDTO {
      return plainToClass(RoleParamDTO, dto, {
        excludeExtraneousValues: true
      });
    }
}

@ApiModel({
  description: 'Update role body object description'
})
export class UpdateRoleBodyDTO {
    @ApiModelProperty({
      description: 'Role Name',
      example: RoleNameEnum.ADMIN
    })
    name?: RoleNameEnum;

    @ApiModelProperty({
      description: 'Role Id',
      enum: [RoleStatusEnum.DISABLE.toString(), RoleStatusEnum.ENABLE.toString(), RoleStatusEnum.INIT.toString()],
      example: RoleStatusEnum.INIT
    })
    status?: RoleStatusEnum;

    @ApiModelProperty({
        description: 'Role is unique for account',
        example: false
    })
    isUnique?: boolean;

    @ApiModelProperty({
      description: 'Role can assess start at',
      example: getDateTime()
    })
    @Transform((param :any) => param ? getDateTime(param.value) : null)
    assessStartAt?: Date;

    @ApiModelProperty({
      description: 'Role can assess end at',
      example: getDateTime().add(10,'day')
    })
    @Transform((param :any) => param ? getDateTime(param.value) : null)
    assessEndAt?: Date;

    @ApiModelProperty({
      description: 'Role can apply count',
      example: 100
    })
    applyCount?: number;

    @ApiModelProperty({
        description: 'Role can apply total count',
        example: 3
    })
    totalCount?: number;

    static plainToClass (dto:any): UpdateRoleBodyDTO {
      return plainToClass(UpdateRoleBodyDTO, dto, {
        excludeExtraneousValues: true
      });
    }
}

@ApiModel({
  description: 'Create role body object description'
})
export class CreateRoleBodyDTO {

    @ApiModelProperty({
      description: 'Role Name',
      example: RoleNameEnum.ADMIN
    })
    name: RoleNameEnum;

    @ApiModelProperty({
      description: 'Role Id',
      enum: [RoleStatusEnum.DISABLE.toString(), RoleStatusEnum.ENABLE.toString(), RoleStatusEnum.INIT.toString()],
      example: RoleStatusEnum.INIT
    })
    status: RoleStatusEnum;

    @ApiModelProperty({
        description: 'Role is unique for account',
        example: false
    })
    isUnique: boolean;

    @ApiModelProperty({
      description: 'Role can assess start at',
      example: getDateTime()
    })
    @Transform((param :any) => param ? getDateTime(param.value) : null)
    assessStartAt?: Date;

    @ApiModelProperty({
      description: 'Role can assess end at',
      example: getDateTime().add(10,'day')
    })
    @Transform((param :any) => param ? getDateTime(param.value) : null)
    assessEndAt?: Date;

    @ApiModelProperty({
      description: 'Role can apply count',
      example: 100
    })
    applyCount: number;
}

export class FindRolesQueryDTO extends PaginationDTO {}

export class CreateRolesBodyDTO {
    @Type(() => CreateRoleBodyDTO)
    @ApiModelProperty({
      description: 'Role Id',
      model: 'CreateRoleBodyDTO'
    })
    items: CreateRoleBodyDTO[];

    static plainToClass (dto:any): CreateRolesBodyDTO {
      return plainToClass(CreateRolesBodyDTO, dto, {
        excludeExtraneousValues: true
      });
    }
}
