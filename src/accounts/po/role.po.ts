/* Import Package */
import { plainToClass, Expose, Type } from 'class-transformer';

/* Type Define */
import { IRoleBase } from "../interfaces/role.interface";
import { PaginationPO } from '../../common/po/pagination.po';

/* Enum & Constant */
import { RoleStatusEnum } from '../../common/enums';

export class RolePO implements IRoleBase {
    @Expose()
    id: number;
    
    @Expose()
    name: string;

    @Expose()
    status: RoleStatusEnum;

    @Expose()
    isUnique: boolean;
    
    @Expose()
    assessStartAt: Date;

    @Expose()
    assessEndAt: Date;

    @Expose()
    applyCount: number;

    @Expose()
    totalCount: number;

    @Expose()
    isDeleted: boolean;

    @Expose()
    version: number;

    static plainToClass (entity:any): RolePO {
      return plainToClass(RolePO, entity, {
        excludeExtraneousValues: true
      });
    }
}

export class RolesPO {
  @Expose()
  @Type(() => RolePO)
  items: RolePO[];
  
  @Expose()
  @Type(() => PaginationPO)
  pagination:PaginationPO;
}