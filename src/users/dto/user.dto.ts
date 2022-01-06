import { GenderEnum } from '../enums/gender.enum'

export class CreateOneUserDTO {
    name: string;
    gender: GenderEnum;
}

export class UpdateOneUserDTO {
    id: number;
    name?: string;
    gender?: GenderEnum;
}
