/* import Package */
import pino from 'pino';
import { connect as amqpCreateConnection, Connection as AmqpConnection } from 'amqplib';
import { AsyncContainerModule } from 'inversify';
import { Controller, TYPE } from 'inversify-express-utils';
import { createConnection as typeORMCreateConnection, Connection as TypeORMConnection } from 'typeorm';

/* Controller Layer */
import { V1AccountController } from './accounts/account.controller';
import { listenAccountEvent } from './accounts/account.event.controller';

/* Service Layer */
import { V1AccountService } from './accounts/account.service';

/* Data Transfer Object */
import {
   CreateAccountBodyDTO,
   CreateAccountsBodyDTO,
   FindAccountsQueryDTO,
   UpdateAccountBodyDTO
 } from './accounts/dto/account.controller.dto';

/* Persistent Object */
import { AccountRepository } from './accounts/repositories/account.repository';

/* Application Object */
import { AccountAO, AccountsAO } from './accounts/ao/account.ao';
import { PaginationAO } from './common/ao/pagination.ao';

/* Config */
import { typeOrmConfig } from './typeorm-config';

const {
   RABBITMQ_USER_NAME,
   RABBITMQ_PASSWORD,
   RABBITMQ_MAPPING_PORT
} = process.env;

export const containerBinding = new AsyncContainerModule(async (bind) => {
   const typeORMConnection = await typeORMCreateConnection(typeOrmConfig);
   const rabbitMQConnection = await amqpCreateConnection(
      `amqp://${RABBITMQ_USER_NAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_MAPPING_PORT}`
   );
   
   /**
    * Connection
    */
   bind<TypeORMConnection>('typeORMConnection').toConstantValue(typeORMConnection);
   bind<AmqpConnection>('rabbitMQConnection').toConstantValue(rabbitMQConnection);

   /**
    * Event Listener
    */
   listenAccountEvent(rabbitMQConnection);

  /**
   * Controller Layer
   */
  bind<Controller>(TYPE.Controller)
    .to(V1AccountController)
    .inSingletonScope()
    .whenTargetNamed(V1AccountController.TARGET_NAME);

  /**
    * Service Layer
    */
  bind<V1AccountService>(V1AccountService.name)
    .to(V1AccountService)
    .inSingletonScope();

  /**
   * Repository Layer
   */
  bind<AccountRepository>(AccountRepository.name).to(AccountRepository);

  /**
   * DTO
   */
  bind<CreateAccountBodyDTO>(CreateAccountBodyDTO.name).to(CreateAccountBodyDTO);
  bind<UpdateAccountBodyDTO>(UpdateAccountBodyDTO.name).to(UpdateAccountBodyDTO);
  bind<FindAccountsQueryDTO>(FindAccountsQueryDTO.name).to(FindAccountsQueryDTO);
  bind<CreateAccountsBodyDTO>(CreateAccountsBodyDTO.name).to(CreateAccountsBodyDTO);

  /**
   * AO
   */
  bind<AccountAO>(AccountAO.name).to(AccountAO);
  bind<AccountsAO>(AccountsAO.name).to(AccountsAO);
  bind<PaginationAO>(PaginationAO.name).to(PaginationAO);

  /**
   * logger
   */
   bind<pino.Logger>('Logger').toConstantValue(pino());

});
