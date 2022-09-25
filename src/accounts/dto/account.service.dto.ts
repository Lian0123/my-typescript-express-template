import { AccountStatusEnum, GenderEnum } from '../../common/enums';
import { IAccountBase } from '../interfaces/account.interface';

export class CreateOneAccountDTO implements Omit<IAccountBase,'id'|'isDeleted'|'roles'> {
    name: string;
    gender: GenderEnum;
    email: string;
    area: string;
    language: string;
    country: string;
    status: AccountStatusEnum;
}

export class UpdateOneAccountDTO {
    id: number;
    name?: string;
    gender?: GenderEnum;
    email?: string;
    area?: string;
    language?: string;
    country?: string;
    isDeleted?: boolean;
    status?: AccountStatusEnum;
    roles?: number[];
}
