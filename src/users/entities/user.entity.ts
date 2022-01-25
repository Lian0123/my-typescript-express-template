import { GenderEnum } from '../enums/gender.enum'
import { IUserBase } from '../interfaces/user.interface'
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm'
import { USERS_TABLE } from '../constants/user.constant';
import 'reflect-metadata'

@Entity({ name: USERS_TABLE })
export class UserEntity implements IUserBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    gender: GenderEnum;
}
