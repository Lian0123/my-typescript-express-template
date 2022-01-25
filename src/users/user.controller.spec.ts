import { Connection, createConnection, getConnection } from 'typeorm'
import { getMockReq } from '@jest-mock/express'
import { typeOrmConfig } from '../typeorm-config'
import { V1UserController } from './user.controller'
import { V1UserService } from './user.service'
import { UserRepository } from './repositories/user.repository'
import { GenderEnum } from './enums/gender.enum'
import { clearTable } from '../util/util'
import { USERS_TABLE } from './constants/user.constant'

let v1UserController: V1UserController
let userService: V1UserService
let userRepository: UserRepository
let connection: Connection

describe('test V1UserController', () => {
  beforeAll(async (done) => {
    // init connection and model
    connection = await createConnection(typeOrmConfig);
    userRepository = getConnection(process.env.POSTGRESQL_CONNECTION_NAME).getCustomRepository(UserRepository);
    userService = new V1UserService(userRepository);
    v1UserController = new V1UserController(userService);

    // need assign test environment, protect other environment data
    expect(process.env.NODE_ENV).toMatch(/^test$|^ci$/)
    done()
  });

  afterAll(async() =>{
    await clearTable(connection, USERS_TABLE);
    connection.close();
  });

  it('test findUserById', async (done) => {
    // create mock data
    await clearTable(connection, USERS_TABLE);
    await userRepository.save({
      id: 1,
      gender: GenderEnum.MALE,
      name: 'josh',
    })

    // create mock request
    const request = getMockReq({
      params: {
        id: '1'
      }
    })
    
    const user = await v1UserController.findUserById(request)
    expect(user?.name).toBe('josh')
    done()
  })
})
