// basic package
import { inject, injectable } from 'inversify';

// inject member
import { getConnection } from 'typeorm';
import { Connection as AmqpConnection } from 'amqplib';
import { AccountRepository } from './repositories/account.repository';

// amqp event
import { createAccountEvent } from './account.event.controller';

// type define
import { CreateOneAccountDTO, UpdateOneAccountDTO } from './dto/account.service.dto';
import { AccountBO, AccountsBO } from './bo/account.bo';

// inject reference
import 'reflect-metadata';

// environment variables
const { POSTGRESQL_CONNECTION_NAME } = process.env;

@injectable()
export class V1AccountService {
  constructor (
    @inject(AccountRepository.name) private accountRepository: AccountRepository,
    @inject('rabbitMQConnection') private rabbitMQConnection: AmqpConnection
  ) {
    this.accountRepository = getConnection(POSTGRESQL_CONNECTION_NAME).getCustomRepository(AccountRepository);
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
}
