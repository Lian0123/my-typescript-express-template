import { AsyncContainerModule } from 'inversify'
import { createConnection } from 'typeorm'
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

export const containerBinding = new AsyncContainerModule(async (bind) => {
  await createConnection(typeOrmConfig)
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
