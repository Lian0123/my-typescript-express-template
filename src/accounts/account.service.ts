/* Import Package */
import { inject, injectable } from 'inversify';

/* Inject Member */
import { Connection as AmqpConnection } from 'amqplib';
import { AccountRepository } from './repositories/account.repository';
import { RoleRepository } from './repositories/role.repository';

/* Controller Layer */
import { createAccountEvent, updateAccountEvent } from './account.event.controller';

/* Type Define */
import { CreateOneAccountDTO, UpdateAccountRoleByDTO, UpdateOneAccountDTO } from './dto/account.service.dto';
import { AccountBO, AccountsBO } from './bo/account.bo';
import { ErrorMessageEnum, serviceError } from '../common/constants';

/* Inject Reference */
import 'reflect-metadata';

@injectable()
export class V1AccountService {
  constructor (
    // The container supplies connected custom repositories in production and simple doubles in tests.
    @inject(AccountRepository.name) private accountRepository: AccountRepository,
    @inject(RoleRepository.name) private roleRepository: RoleRepository,
    @inject('rabbitMQConnection') private rabbitMQConnection: AmqpConnection
  ) {}

  async findOneAccountById (id:number) :Promise<AccountBO> {
    return await this.accountRepository.findOneById(id);
  }

  async createOneAccountByDTO (dto: CreateOneAccountDTO) :Promise<AccountBO> {
    const accountData = await this.accountRepository.createOneByDTO(dto);
    await createAccountEvent(this.rabbitMQConnection, accountData);
    return accountData;
  }

  async updateOneAccountById (dto: UpdateOneAccountDTO) :Promise<AccountBO> {
    const accountData = await this.accountRepository.updateOneByDTO(dto);
    await updateAccountEvent(this.rabbitMQConnection, accountData);
    return accountData;
  }

  async deleteOneAccountById (id: number) :Promise<void> {
    await this.accountRepository.deleteOneById(id);
  }

  async findManyAccountByLimitAndOffset (limit:number, offset:number) :Promise<AccountsBO> {
    return await this.accountRepository.findManyByLimitAndOffset(limit, offset);
  }

  async updateAccountRoleByDTO (dto: UpdateAccountRoleByDTO) :Promise<void> {
    const { id, roles } = dto;
    const account = await this.accountRepository.findOneById(id);
    if(!account){
      throw serviceError(ErrorMessageEnum.TEMPLATE_ACCOUNT_DATA_NOT_FOUND);
    }
    
    const nowRoles = await this.roleRepository.findManyByIds(account.roles);
    const matchRoles = await this.roleRepository.findManyByIds(roles);
    const nowRoleIds = nowRoles.map((role) => role.id);
    const matchRoleIds = matchRoles.map((role) => role.id);

    // Test roles is exist
    if(roles.length !== matchRoleIds.length) {
      const notExistRoles :number[] = roles.filter((role) => !matchRoleIds.includes(role));
      throw serviceError(ErrorMessageEnum.TEMPLATE_ROLE_NO_EXIST, notExistRoles);
    }

    // Test has multi isUnique role
    for (const role of matchRoles) {
      if (role.isUnique && matchRoles.length > 1) {
        throw serviceError(ErrorMessageEnum.TEMPLATE_ACCOUNT_ROLE_IS_UNIQUE, role.id);
      }
    }

    const accountData = await this.accountRepository.updateOneByDTO({ id, roles: matchRoleIds });
    await this.roleRepository.updateManyCountByIds(
      matchRoleIds.filter((role) => !nowRoleIds.includes(role)),
      nowRoleIds.filter((role) => !matchRoleIds.includes(role))
    );
    await updateAccountEvent(this.rabbitMQConnection, accountData);
  }
}
