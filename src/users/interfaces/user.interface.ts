import { GenderEnum } from '../enums/gender.enum'

export interface IUserBase {
    id: number;
    name: string;
    gender: GenderEnum;
}
