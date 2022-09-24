/* import Package */
import { PrimaryGeneratedColumn, Column, Entity, VersionColumn } from 'typeorm';

/* Type & Interface */
import { IAccountBase } from '../interfaces/account.interface';

/* Enum & Constant */
import { AccountStatusEnum, GenderEnum } from '../../common/enums';
import { ACCOUNTS_TABLE } from '../constants/account.constant';

/* inversify */
import 'reflect-metadata';

@Entity({ name: ACCOUNTS_TABLE })
export class AccountEntity implements IAccountBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    gender: GenderEnum;

    @Column()
    email: string;

    @Column()
    area: string;

    @Column()
    language: string;

    @Column()
    country: string;

    @Column({ default: false})
    isDeleted: boolean;

    @Column("int", { array: true, default: [] })
    roles: number[];

    @Column()
    status: AccountStatusEnum;

    @VersionColumn()
    version: number;
}
