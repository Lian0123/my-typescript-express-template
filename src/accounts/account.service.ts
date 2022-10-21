/* Import Package */
import { inject, injectable } from 'inversify';

/* Inject Member */
import { getConnection } from 'typeorm';
import { Connection as AmqpConnection } from 'amqplib';
import { AccountRepository } from './repositories/account.repository';
import { RoleRepository } from './repositories/role.repository';

/* Controller Layer */
import { createAccountEvent } from './account.event.controller';

/* Type Define */
import { CreateOneAccountDTO, UpdateAccountRoleByDTO, UpdateOneAccountDTO } from './dto/account.service.dto';
import { AccountBO, AccountsBO } from './bo/account.bo';
import { ErrorMessageEnum, serviceError } from '../common/constants';

/* Inject Reference */
import 'reflect-metadata';

/* Environment Variables */
const { POSTGRESQL_CONNECTION_NAME } = process.env;

@injectable()
export class V1AccountService {
  constructor (
    @inject(AccountRepository.name) private accountRepository: AccountRepository,
    @inject(RoleRepository.name) private roleRepository: RoleRepository,
    @inject('rabbitMQConnection') private rabbitMQConnection: AmqpConnection
  ) {
    this.accountRepository = getConnection(POSTGRESQL_CONNECTION_NAME).getCustomRepository(AccountRepository);
    this.roleRepository = getConnection(POSTGRESQL_CONNECTION_NAME).getCustomRepository(RoleRepository);
  }

  async findOneAccountById (id:number) :Promise<AccountBO> {
    return await this.accountRepository.findOneById(id);
  }

  async createOneAccountByDTO (dto: CreateOneAccountDTO) :Promise<void> {
    const accountData = await this.accountRepository.createOneByDTO(dto);
    await createAccountEvent(this.rabbitMQConnection, accountData);
  }

  async updateOneAccountById (dto: UpdateOneAccountDTO) :Promise<void> {
    await this.accountRepository.updateOneByDTO(dto);
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
    const nowRoleIds = nowRoles.map(role => role.id);
    const matchRoleIds = matchRoles.map(role => role.id);

    // Test roles is exist
    if(roles.length !== matchRoleIds.length) {
      const notExistRoles :number[] = roles.filter(role => !matchRoleIds.includes(role) );
      throw serviceError(ErrorMessageEnum.TEMPLATE_ROLE_NO_EXIST, notExistRoles);
    }

    // Test has multi isUnique role
    for (const role of matchRoles) {
      if(role.isUnique && matchRoles.length > 1) {
        throw serviceError(ErrorMessageEnum.TEMPLATE_ACCOUNT_ROLE_IS_UNIQUE, role.id);
      }
    }

    await this.accountRepository.updateOneByDTO({ id, roles: matchRoleIds });
    await this.roleRepository.updateManyCountByIds(
      matchRoleIds.filter(role => !nowRoleIds.includes(role)),
      nowRoleIds.filter(role => !matchRoleIds.includes(role))
    );
  }
}
