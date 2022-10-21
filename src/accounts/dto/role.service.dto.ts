/* Type & Interface */
import { IRoleBase } from '../interfaces/role.interface';

/* Enum & Constant */
import { RoleStatusEnum } from '../../common/enums';
export class CreateOneRoleDTO  implements Omit<IRoleBase,'id'|'isDeleted'|'totalCount'> {
    name: string;
    status: RoleStatusEnum;
    isUnique: boolean;
    assessStartAt?: Date;
    assessEndAt?: Date;
    applyCount: number;
}

export class UpdateOneRoleDTO {
    id: number;
    name?: string;
    status?: RoleStatusEnum;
    isUnique?: boolean;
    assessStartAt?: Date;
    assessEndAt?: Date;
    applyCount?: number;
    totalCount?: number;
    isDeleted?: boolean;
}