/* Import Package */
import { ApiModel } from 'swagger-express-ts';

/* Type & Interface */
import { RolePO, RolesPO } from '../po/role.po';

@ApiModel({
    description: 'Role BO'
})
export class RoleBO extends RolePO {}
export class RolesBO extends RolesPO {}