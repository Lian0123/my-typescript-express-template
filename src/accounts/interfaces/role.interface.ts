/* Enum & Constant */
import { RoleStatusEnum } from '../../common/enums';

export interface IRoleBase {
    id: number;
    name: string;
    status: RoleStatusEnum;
    isUnique: boolean;
    assessStartAt?: Date;
    assessEndAt?: Date;
    applyCount: number;
    totalCount: number;
    isDeleted: boolean;
}
