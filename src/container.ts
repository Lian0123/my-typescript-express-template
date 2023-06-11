/* Import Package */
import pino from 'pino';
import { connect as amqpCreateConnection, Connection as AmqpConnection } from 'amqplib';
import { AsyncContainerModule, decorate, injectable } from 'inversify';
import { Controller, TYPE } from 'inversify-express-utils';
import { createConnection as typeORMCreateConnection, Connection as TypeORMConnection, Repository } from 'typeorm';
import { initializeTransactionalContext, BaseRepository } from 'typeorm-transactional-cls-hooked';
import { interfaces } from "inversify-socket-utils";

/* Controller Layer */
import { V1AccountController } from './accounts/account.controller';
import { V1RoleController } from './accounts/role.controller';
import { listenAccountCreatedEvent, listenAccountUpdatedEvent } from './accounts/account.event.controller';
import { listenRoleCreatedEvent, listenRoleUpdatedEvent } from './accounts/role.event.controller';
import { ChattingController } from './chatting/chatting.socket.controller';

/* Service Layer */
import { V1AccountService } from './accounts/account.service';
import { V1RoleService } from './accounts/role.service';

/* Repository Layer */
import { AccountRepository } from './accounts/repositories/account.repository';
import { RoleRepository } from './accounts/repositories/role.repository';

/* Type & Interface */
import { AccountAO, AccountsAO } from './accounts/ao/account.ao';
import { RoleAO, RolesAO } from './accounts/ao/role.ao';
import { PaginationAO } from './common/ao/pagination.ao';
import {
   CreateAccountBodyDTO,
   CreateAccountsBodyDTO,
   FindAccountsQueryDTO,
   UpdateAccountBodyDTO
} from './accounts/dto/account.controller.dto';
import {
   CreateRoleBodyDTO,
   CreateRolesBodyDTO,
   FindRolesQueryDTO,
   UpdateRoleBodyDTO
} from './accounts/dto/role.controller.dto';

/* Config & Environment Variables */
import { typeOrmConfig } from './typeorm-config';
const {
   RABBITMQ_USER_NAME,
   RABBITMQ_PASSWORD,
   RABBITMQ_MAPPING_PORT,
   RABBITMQ_HEART_BEAT
} = process.env;

export const containerBinding = new AsyncContainerModule(async (bind) => {
   const typeORMConnection = await typeORMCreateConnection(typeOrmConfig);
   const rabbitMQConnection = await amqpCreateConnection(
      `amqp://${RABBITMQ_USER_NAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_MAPPING_PORT}?heartbeat=${RABBITMQ_HEART_BEAT}`
   );
   
   initializeTransactionalContext(); // Initialize cls-hooked

   /**
    * Connection
    */
   bind<TypeORMConnection>('typeORMConnection').toConstantValue(typeORMConnection);
   bind<AmqpConnection>('rabbitMQConnection').toConstantValue(rabbitMQConnection);

  /**
   * Event Cerate & Listener
   */
  listenAccountCreatedEvent(rabbitMQConnection);
  listenAccountUpdatedEvent(rabbitMQConnection);
  listenRoleCreatedEvent(rabbitMQConnection);
  listenRoleUpdatedEvent(rabbitMQConnection);

  /**
   * Socket.io
   */
  bind<interfaces.Controller>(TYPE.Controller).to(ChattingController);

  /**
   * Controller Layer
   */
  bind<Controller>(TYPE.Controller)
    .to(V1AccountController)
    .inSingletonScope()
    .whenTargetNamed(V1AccountController.TARGET_NAME);
  bind<Controller>(TYPE.Controller)
    .to(V1RoleController)
    .inSingletonScope()
    .whenTargetNamed(V1RoleController.TARGET_NAME);
    
  /**
    * Service Layer
    */
  bind<V1AccountService>(V1AccountService.name)
    .to(V1AccountService)
    .inSingletonScope();
  bind<V1RoleService>(V1RoleService.name)
    .to(V1RoleService)
    .inSingletonScope();

  /**
   * Repository Layer
   */
  decorate(injectable(), Repository);
  decorate(injectable(), BaseRepository);
  bind<AccountRepository>(AccountRepository.name).to(AccountRepository);
  bind<RoleRepository>(RoleRepository.name).to(RoleRepository);
  
  /**
   * Data Transfer Object
   */
  bind<CreateAccountBodyDTO>(CreateAccountBodyDTO.name).to(CreateAccountBodyDTO);
  bind<CreateAccountsBodyDTO>(CreateAccountsBodyDTO.name).to(CreateAccountsBodyDTO);
  bind<UpdateAccountBodyDTO>(UpdateAccountBodyDTO.name).to(UpdateAccountBodyDTO);
  bind<FindAccountsQueryDTO>(FindAccountsQueryDTO.name).to(FindAccountsQueryDTO);
  bind<CreateRoleBodyDTO>(CreateRoleBodyDTO.name).to(CreateRoleBodyDTO);
  bind<CreateRolesBodyDTO>(CreateRolesBodyDTO.name).to(CreateRolesBodyDTO);
  bind<FindRolesQueryDTO>(FindRolesQueryDTO.name).to(FindRolesQueryDTO);
  bind<UpdateRoleBodyDTO>(UpdateRoleBodyDTO.name).to(UpdateRoleBodyDTO);

  /**
   * Application Object
   */
  bind<AccountAO>(AccountAO.name).to(AccountAO);
  bind<AccountsAO>(AccountsAO.name).to(AccountsAO);
  bind<RoleAO>(RoleAO.name).to(RoleAO);
  bind<RolesAO>(RolesAO.name).to(RolesAO);
  bind<PaginationAO>(PaginationAO.name).to(PaginationAO);

  /**
   * logger
   */
   bind<pino.Logger>('Logger').toConstantValue(pino());

});
