/* Import Package */
import { PrimaryGeneratedColumn, Column, Entity, VersionColumn } from 'typeorm';

/* Type & Interface */
import { IRoleBase } from '../interfaces/role.interface';

/* Enum & Constant */
import { RoleStatusEnum } from '../../common/enums';
import { ROLES_TABLE } from '../constants/account.constant';

/* Inject Reference */
import 'reflect-metadata';

@Entity({ name: ROLES_TABLE })
export class RoleEntity implements IRoleBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    status: RoleStatusEnum;

    @Column()
    isUnique: boolean;

    @Column()
    assessStartAt: Date;

    @Column()
    assessEndAt: Date;

    @Column()
    applyCount: number

    @Column({ default: 0})
    totalCount: number

    @Column({ default: false})
    isDeleted: boolean;

    @VersionColumn()
    version: number;
}
