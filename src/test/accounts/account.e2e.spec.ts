/* Import Package */
import * as express from 'express';
import * as supertest from 'supertest';
import { randomUUID } from 'crypto';
import { Container } from 'inversify';
import { Connection, getConnection } from 'typeorm';
import { InversifyExpressServer } from 'inversify-express-utils';

/* Repository Layer */
import { AccountRepository } from '../../accounts/repositories/account.repository';

/* Define Utils */
import { clearTable } from '../../utils';

/* Enum & Constant */
import { AccountStatusEnum, GenderEnum } from '../../common/enums';
import { ACCOUNTS_TABLE } from '../../accounts/constants/account.constant';
import { ErrorHandler } from '../../common/constants';

/* Inject Reference */
import 'reflect-metadata';

/* Config & Environment Variables */
import { containerBinding } from '../../container';
const {
  NODE_ENV,
  POSTGRESQL_CONNECTION_NAME,
} = process.env;

let app: express.Application;
let accountRepository: AccountRepository;
let connection: Connection;


describe('GET /account', () => {
  beforeAll(async (done) => {
    // init server
    const container = new Container();
    await container.loadAsync(containerBinding);
    const server = new InversifyExpressServer(container);


    server.setConfig((app : any) => {
      // Overwrite Headers
      app.use((request: Request, response: Response, next: express.NextFunction) => {
        request.headers['requestId'] = randomUUID();
        next();
      });
    });
    app = server.build();
    app.use(ErrorHandler);

    // init connection and model
    connection = getConnection(POSTGRESQL_CONNECTION_NAME);
    accountRepository = connection.getCustomRepository(AccountRepository);
    
    // need assign test environment, protect other environment data
    expect(NODE_ENV).toMatch(/^test$|^ci$/);
    done();
  });
  
  afterAll(async() =>{
    await clearTable(connection, ACCOUNTS_TABLE);
    connection.close();
  });

  it('/v1/accounts/1', async (done) => {
    // create mock data
    await clearTable(connection, ACCOUNTS_TABLE);
    await accountRepository.save({
      id: 1,
      name: 'josh',
      email: 'example@mail.com',
      gender: GenderEnum.MALE,
      language: 'Japanese',
      area: 'Asia',
      country: 'Japan',
      roles: [1,2,3],
      status: AccountStatusEnum.ENABLE,
    });

    supertest(app)
      .get('/v1/accounts/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body?.id).toBe(1);
        done();
      });
  });
});
