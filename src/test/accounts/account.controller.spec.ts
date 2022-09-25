/* Import Package */
import { connect as amqpCreateConnection, Connection as AmqpConnection } from 'amqplib';
import { createConnection as typeORMCreateConnection, Connection as TypeORMConnection, getConnection } from 'typeorm';
import { getMockReq } from '@jest-mock/express';

/* Controller Layer */
import { V1AccountController } from '../../accounts/account.controller';

/* Service Layer */
import { V1AccountService } from '../../accounts/account.service';

/* Repository Layer */
import { AccountRepository } from '../../accounts/repositories/account.repository';

/* Define Utils */
import { clearTable } from '../../utils';

/* Enum & Constant */
import { AccountStatusEnum, GenderEnum } from '../../common/enums';
import { ACCOUNTS_TABLE } from '../../accounts/constants/account.constant';

/* Config & Environment Variables */
import { typeOrmConfig } from '../../typeorm-config';
const {
  NODE_ENV,
  RABBITMQ_USER_NAME,
  RABBITMQ_PASSWORD,
  RABBITMQ_MAPPING_PORT,
  POSTGRESQL_CONNECTION_NAME,
} = process.env;

jest.mock('../../accounts/account.event.controller');

let v1AccountController: V1AccountController;
let accountService: V1AccountService;
let accountRepository: AccountRepository;
let typeORMConnection: TypeORMConnection;
let rabbitMQConnection: AmqpConnection;

describe('test V1AccountController', () => {
  beforeAll(async (done) => {
    // init connection and model
    typeORMConnection = await typeORMCreateConnection(typeOrmConfig);
    rabbitMQConnection= await amqpCreateConnection(
      `amqp://${RABBITMQ_USER_NAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_MAPPING_PORT}`
    );
    accountRepository = getConnection(POSTGRESQL_CONNECTION_NAME).getCustomRepository(AccountRepository);
    accountService = new V1AccountService(accountRepository,rabbitMQConnection);
    v1AccountController = new V1AccountController(accountService);

    // need assign test environment, protect other environment data
    expect(NODE_ENV).toMatch(/^test$|^ci$/);
    done();
  });

  afterAll(async() =>{
    await clearTable(typeORMConnection, ACCOUNTS_TABLE);
    typeORMConnection.close();
    rabbitMQConnection.close();
  });

  it('test findAccountById', async (done) => {
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

    // create mock request
    const request = getMockReq({
      params: {
        id: '1'
      }
    });
    
    const account = await v1AccountController.findAccountById(request);
    expect(account?.name).toBe('josh');
    done();
  });
});
