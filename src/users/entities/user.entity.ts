import { GenderEnum } from '../enums/gender.enum'
import { IUserBase } from '../interfaces/user.interface'
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm'
import 'reflect-metadata'

@Entity({ name: 'users' })
export class UserEntity implements IUserBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    gender: GenderEnum;
}
