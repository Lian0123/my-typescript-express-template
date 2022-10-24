/* Import Package */
import { plainToClass, Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsISO8601, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
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
    @IsNumberString()
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
    @IsString()
    @IsOptional()
    name?: string;

    @ApiModelProperty({
      description: 'Role Id',
      enum: Object.keys(RoleStatusEnum),
      example: RoleStatusEnum.INIT
    })
    @IsEnum(RoleStatusEnum)
    @IsOptional()
    status?: RoleStatusEnum;

    @ApiModelProperty({
        description: 'Role is unique for account',
        example: false
    })
    @IsBoolean()
    @IsOptional()
    isUnique?: boolean;

    @ApiModelProperty({
      description: 'Role can assess start at',
      example: getDateTime()
    })
    @Transform((param :any) => param ? getDateTime(param.value) : null)
    @IsISO8601()
    @IsOptional()
    assessStartAt?: Date;

    @ApiModelProperty({
      description: 'Role can assess end at',
      example: getDateTime().add(10,'day')
    })
    @Transform((param :any) => param ? getDateTime(param.value) : null)
    @IsISO8601()
    @IsOptional()
    assessEndAt?: Date;

    @ApiModelProperty({
      description: 'Role can apply count',
      example: 100
    })
    @IsNumber()
    @IsOptional()
    applyCount?: number;

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
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiModelProperty({
      description: 'Role Id',
      enum: Object.keys(RoleStatusEnum),
      example: RoleStatusEnum.INIT
    })
    @IsEnum(RoleStatusEnum)
    status: RoleStatusEnum;

    @ApiModelProperty({
        description: 'Role is unique for account',
        example: false
    })
    @IsBoolean()
    isUnique: boolean;

    @ApiModelProperty({
      description: 'Role can assess start at',
      example: getDateTime()
    })
    @Transform((param :any) => param ? getDateTime(param.value) : null)
    @IsISO8601()
    assessStartAt?: Date;

    @ApiModelProperty({
      description: 'Role can assess end at',
      example: getDateTime().add(10,'day')
    })
    @Transform((param :any) => param ? getDateTime(param.value) : null)
    @IsISO8601()
    assessEndAt?: Date;

    @ApiModelProperty({
      description: 'Role can apply count',
      example: 100
    })
    @IsNumber()
    applyCount: number;
}

export class FindRolesQueryDTO extends PaginationDTO {}

export class CreateRolesBodyDTO {
    @Type(() => CreateRoleBodyDTO)
    @ApiModelProperty({
      description: 'Role Id',
      model: 'CreateRoleBodyDTO'
    })
    @IsArray()
    items: CreateRoleBodyDTO[];

    static plainToClass (dto:any): CreateRolesBodyDTO {
      return plainToClass(CreateRolesBodyDTO, dto, {
        excludeExtraneousValues: true
      });
    }
}
