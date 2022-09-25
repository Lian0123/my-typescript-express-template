/* Import Package */
import { PrimaryGeneratedColumn, Column, Entity, VersionColumn } from 'typeorm';

/* Type & Interface */
import { IRoleBase } from '../interfaces/role.interface';

/* Enum & Constant */
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
    applyCount: string

    @Column()
    totalCount: string

    @Column()
    isDeleted: boolean;

    @VersionColumn()
    version: number;
}
