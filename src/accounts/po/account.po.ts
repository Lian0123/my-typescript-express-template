/* Import Package */
import { plainToClass, Expose, Type } from 'class-transformer';

/* Type Define */
import { IAccountBase } from "../interfaces/account.interface";
import { PaginationPO } from '../../common/po/pagination.po';

/* Enum & Constant */
import { AccountStatusEnum, GenderEnum } from '../../common/enums';

export class AccountPO implements IAccountBase {
    @Expose()
    id: number;
    
    @Expose()
    name: string;

    @Expose()
    gender: GenderEnum;

    @Expose()
    email: string;
    
    @Expose()
    language: string;

    @Expose()
    area: string;

    @Expose()
    country: string;

    @Expose()
    isDeleted: boolean;

    @Expose()
    roles: number[];

    @Expose()
    status: AccountStatusEnum;

    static plainToClass (entity:any): AccountPO {
      return plainToClass(AccountPO, entity, {
        excludeExtraneousValues: true
      });
    }
}

export class AccountsPO {
  @Expose()
  @Type(() => AccountPO)
  items: AccountPO[];
  
  @Expose()
  @Type(() => PaginationPO)
  pagination:PaginationPO;
}