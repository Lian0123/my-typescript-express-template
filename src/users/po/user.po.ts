import { plainToClass } from 'class-transformer'
import { Expose } from "class-transformer";
import { GenderEnum } from "../enums/gender.enum";
import { IUserBase } from "../interfaces/user.interface";

export class UserPO implements IUserBase {
    @Expose()
    id: number;
    
    @Expose()
    name: string;

    @Expose()
    gender: GenderEnum;

    static plainToClass (entity:any): UserPO {
      return plainToClass(UserPO, entity, {
        excludeExtraneousValues: true
      })
    }
}