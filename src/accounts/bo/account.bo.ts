import { ApiModel } from 'swagger-express-ts';
import { AccountPO, AccountsPO } from '../po/account.po';

@ApiModel({
    description: 'Account BO'
})
export class AccountBO extends AccountPO {}
export class AccountsBO extends AccountsPO {}