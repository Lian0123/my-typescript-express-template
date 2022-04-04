import { AsyncContainerModule } from 'inversify'
import { createConnection as typeORMCreateConnection, Connection as TypeORMConnection } from 'typeorm'
import { typeOrmConfig } from './typeorm-config'
import { Controller, TYPE } from 'inversify-express-utils'
import { V1UserController } from './users/user.controller'
import { V1UserService } from './users/user.service'
import {
  CreateUserBodyDTO,
  CreateUsersBodyDTO,
  FindUsersQueryDTO,
  UpdateUserBodyDTO
} from './users/dto/user.controller.dto'
import { UserRepository } from './users/repositories/user.repository'
import { UserAO, UsersAO } from './users/ao/user.ao'
import { PaginationAO } from './common/ao/pagination.ao'
import { connect as amqpCreateConnection, Connection as AmqpConnection } from 'amqplib'
import { listenUserEvent } from './users/user.event.controller';

export const containerBinding = new AsyncContainerModule(async (bind) => {
   const typeORMConnection = await typeORMCreateConnection(typeOrmConfig)
   const rabbitMQConnection = await amqpCreateConnection(
      `amqp://${process.env.RABBITMQ_USER_NAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_MAPPING_PORT}`
   );
   
   /**
    * Connection
    */
   bind<TypeORMConnection>('typeORMConnection').toConstantValue(typeORMConnection)
   bind<AmqpConnection>('rabbitMQConnection').toConstantValue(rabbitMQConnection)

   /**
    * Event Listener
    */
   listenUserEvent(rabbitMQConnection)

   /**
     * Controller Layer
     */
  bind<Controller>(TYPE.Controller)
    .to(V1UserController)
    .inSingletonScope()
    .whenTargetNamed(V1UserController.TARGET_NAME)

  /**
     * Service Layer
     */
  bind<V1UserService>(V1UserService.name)
    .to(V1UserService)
    .inSingletonScope()

  /**
     * Repository Layer
     */
  bind<UserRepository>(UserRepository.name).to(UserRepository)

  /**
     * DTO
     */
  bind<CreateUserBodyDTO>(CreateUserBodyDTO.name).to(CreateUserBodyDTO)
  bind<UpdateUserBodyDTO>(UpdateUserBodyDTO.name).to(UpdateUserBodyDTO)
  bind<FindUsersQueryDTO>(FindUsersQueryDTO.name).to(FindUsersQueryDTO)
  bind<CreateUsersBodyDTO>(CreateUsersBodyDTO.name).to(CreateUsersBodyDTO)

  /**
     * AO
     */
  bind<UserAO>(UserAO.name).to(UserAO)
  bind<UsersAO>(UsersAO.name).to(UsersAO)
  bind<PaginationAO>(PaginationAO.name).to(PaginationAO)
})
