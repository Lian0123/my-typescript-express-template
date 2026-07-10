/* Import Package */
import pino from 'pino';
import { connect as amqpCreateConnection, Connection as AmqpConnection } from 'amqplib';
import { AsyncContainerModule, decorate, injectable } from 'inversify';
import { Controller, TYPE as API_TYPE } from 'inversify-express-utils';
import { MongoClient } from 'mongodb';
import { createConnection as typeORMCreateConnection, Connection as TypeORMConnection, Repository } from 'typeorm';
import { initializeTransactionalContext, BaseRepository } from 'typeorm-transactional-cls-hooked';
import { interfaces, TYPE as SOCKET_TYPE } from "inversify-socket-utils";

/* Controller Layer */
import { V1AccountController } from './accounts/account.controller';
import { V1RoleController } from './accounts/role.controller';
import { listenAccountCreatedEvent, listenAccountUpdatedEvent } from './accounts/account.event.controller';
import { listenRoleCreatedEvent, listenRoleUpdatedEvent } from './accounts/role.event.controller';
import { ChattingController } from './chatting/chatting.socket.controller';
import { V1TimeSeriesController } from './timeseries/time-series.controller';

/* Service Layer */
import { V1AccountService } from './accounts/account.service';
import { V1RoleService } from './accounts/role.service';
import { V1TimeSeriesService } from './timeseries/time-series.service';

/* Repository Layer */
import { AccountRepository } from './accounts/repositories/account.repository';
import { RoleRepository } from './accounts/repositories/role.repository';
import { TimeSeriesSampleRepository } from './timeseries/repositories/time-series.repository';

/* Type & Interface */
import { AccountAO, AccountsAO } from './accounts/ao/account.ao';
import { RoleAO, RolesAO } from './accounts/ao/role.ao';
import { PaginationAO } from './common/ao/pagination.ao';
import { TimeSeriesSampleAO, TimeSeriesSamplesAO, TimeSeriesSummaryAO } from './timeseries/ao/time-series.ao';
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
import {
   CreateTimeSeriesSampleBodyDTO,
   CreateTimeSeriesSamplesBodyDTO,
   FindTimeSeriesSamplesQueryDTO,
   FindTimeSeriesSummaryQueryDTO
} from './timeseries/dto/time-series.controller.dto';

/* Config & Environment Variables */
import { typeOrmConfig } from './typeorm-config';
const {
   MONGO_UERNAME,
   MONGO_PASSWORD,
   MONGO_MAPPING_PORT,
   RABBITMQ_USER_NAME,
   RABBITMQ_PASSWORD,
   RABBITMQ_MAPPING_PORT,
   RABBITMQ_HEART_BEAT,
} = process.env;

export const containerBinding = new AsyncContainerModule(async (bind) => {
  const mongoDBConnection = new MongoClient(
    `mongodb://${MONGO_UERNAME}:${MONGO_PASSWORD}@${MONGO_MAPPING_PORT}`,
    { useUnifiedTopology: true },
   ).connect();
   const typeORMConnection = await typeORMCreateConnection(typeOrmConfig);
   const rabbitMQConnection = await amqpCreateConnection(
      `amqp://${RABBITMQ_USER_NAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_MAPPING_PORT}?heartbeat=${RABBITMQ_HEART_BEAT}`
   );
   
   initializeTransactionalContext(); // Initialize cls-hooked

   /**
    * Connection
    */
    bind<Promise<MongoClient>>('mongoDBConnection').toConstantValue(mongoDBConnection);
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
  bind<interfaces.Controller>(SOCKET_TYPE.Controller)
    .to(ChattingController)
    .inSingletonScope()
    .whenTargetNamed(ChattingController.TARGET_NAME);

  /**
   * Controller Layer
   */
  bind<Controller>(API_TYPE.Controller)
    .to(V1AccountController)
    .inSingletonScope()
    .whenTargetNamed(V1AccountController.TARGET_NAME);
  bind<Controller>(API_TYPE.Controller)
    .to(V1RoleController)
    .inSingletonScope()
    .whenTargetNamed(V1RoleController.TARGET_NAME);
  bind<Controller>(API_TYPE.Controller)
    .to(V1TimeSeriesController)
    .inSingletonScope()
    .whenTargetNamed(V1TimeSeriesController.TARGET_NAME);

  /**
    * Service Layer
    */
  bind<V1AccountService>(V1AccountService.name)
    .to(V1AccountService)
    .inSingletonScope();
  bind<V1RoleService>(V1RoleService.name)
    .to(V1RoleService)
    .inSingletonScope();
  bind<V1TimeSeriesService>(V1TimeSeriesService.name)
    .to(V1TimeSeriesService)
    .inSingletonScope();

  /**
   * Repository Layer
   */
  decorate(injectable(), Repository);
  decorate(injectable(), BaseRepository);
  // Bind the TypeORM custom repositories from the live connection so services stay testable.
  bind<AccountRepository>(AccountRepository.name)
    .toConstantValue(typeORMConnection.getCustomRepository(AccountRepository));
  bind<RoleRepository>(RoleRepository.name)
    .toConstantValue(typeORMConnection.getCustomRepository(RoleRepository));
  bind<TimeSeriesSampleRepository>(TimeSeriesSampleRepository.name)
    .toConstantValue(typeORMConnection.getCustomRepository(TimeSeriesSampleRepository));
  
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
  bind<CreateTimeSeriesSampleBodyDTO>(CreateTimeSeriesSampleBodyDTO.name).to(CreateTimeSeriesSampleBodyDTO);
  bind<CreateTimeSeriesSamplesBodyDTO>(CreateTimeSeriesSamplesBodyDTO.name).to(CreateTimeSeriesSamplesBodyDTO);
  bind<FindTimeSeriesSamplesQueryDTO>(FindTimeSeriesSamplesQueryDTO.name).to(FindTimeSeriesSamplesQueryDTO);
  bind<FindTimeSeriesSummaryQueryDTO>(FindTimeSeriesSummaryQueryDTO.name).to(FindTimeSeriesSummaryQueryDTO);

  /**
   * Application Object
   */
  bind<AccountAO>(AccountAO.name).to(AccountAO);
  bind<AccountsAO>(AccountsAO.name).to(AccountsAO);
  bind<RoleAO>(RoleAO.name).to(RoleAO);
  bind<RolesAO>(RolesAO.name).to(RolesAO);
  bind<PaginationAO>(PaginationAO.name).to(PaginationAO);
  bind<TimeSeriesSampleAO>(TimeSeriesSampleAO.name).to(TimeSeriesSampleAO);
  bind<TimeSeriesSamplesAO>(TimeSeriesSamplesAO.name).to(TimeSeriesSamplesAO);
  bind<TimeSeriesSummaryAO>(TimeSeriesSummaryAO.name).to(TimeSeriesSummaryAO);

  /**
   * logger
   */
   bind<pino.Logger>('Logger').toConstantValue(pino());

});
