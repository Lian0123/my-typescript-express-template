/* Enum & Constant */
import { AccountStatusEnum, GenderEnum } from '../../common/enums';

export interface IAccountBase {
    id: number;
    name: string;
    gender: GenderEnum;
    email: string;
    area: string;
    language: string;
    country: string;
    isDeleted: boolean;
    status: AccountStatusEnum;
    roles: number[];
}
