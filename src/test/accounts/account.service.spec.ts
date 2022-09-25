import { createConnection as typeORMCreateConnection, Connection as TypeORMConnection, getConnection } from 'typeorm';
import { connect as amqpCreateConnection, Connection as AmqpConnection } from 'amqplib';
import { typeOrmConfig } from '../../typeorm-config';
import { V1AccountService } from '../../accounts/account.service';
import { AccountRepository } from '../../accounts/repositories/account.repository';
import { AccountStatusEnum, GenderEnum } from '../../common/enums';
import { clearTable } from '../../util/util';
import { ACCOUNTS_TABLE } from '../../accounts/constants/account.constant';

const {
  NODE_ENV,
  RABBITMQ_USER_NAME,
  RABBITMQ_PASSWORD,
  RABBITMQ_MAPPING_PORT,
  POSTGRESQL_CONNECTION_NAME,
} = process.env;

jest.mock('../../accounts/account.event.controller');

let accountService: V1AccountService;
let typeORMConnection: TypeORMConnection;
let rabbitMQConnection: AmqpConnection;
let accountRepository: AccountRepository;

describe('test accountService', () => {
  beforeAll(async (done) => {
    typeORMConnection = await typeORMCreateConnection(typeOrmConfig);
    rabbitMQConnection= await amqpCreateConnection(
      `amqp://${RABBITMQ_USER_NAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_MAPPING_PORT}`
    );
    accountRepository = getConnection(POSTGRESQL_CONNECTION_NAME).getCustomRepository(AccountRepository);
    accountService = new V1AccountService(accountRepository,rabbitMQConnection);
    
    // need assign test environment, protect other environment data
    expect(NODE_ENV).toMatch(/^test$|^ci$/);
    done();
  });

  afterAll(async() =>{
    // truncate table data
    await clearTable(typeORMConnection, ACCOUNTS_TABLE);
    typeORMConnection.close();
    rabbitMQConnection.close();
  });

  it('test findOneAccountById', async (done) => {
    // create mock data
    await clearTable(typeORMConnection, ACCOUNTS_TABLE);
    await accountRepository.save({
      name: 'josh',
      email: 'example@mail.com',
      gender: GenderEnum.MALE,
      language: 'Japanese',
      area: 'Asia',
      country: 'Japan',
      roles: [1,2,3],
      status: AccountStatusEnum.ENABLE,
    });

    const account = await accountService.findOneAccountById(1);
    expect(account?.name).toBe('josh');
    done();
  });

});
