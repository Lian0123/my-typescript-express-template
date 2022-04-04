import { createConnection as typeORMCreateConnection, Connection as TypeORMConnection, getConnection } from 'typeorm'
import { connect as amqpCreateConnection, Connection as AmqpConnection } from 'amqplib'
import { getMockReq } from '@jest-mock/express'
import { typeOrmConfig } from '../typeorm-config'
import { V1UserController } from './user.controller'
import { V1UserService } from './user.service'
import { UserRepository } from './repositories/user.repository'
import { GenderEnum } from './enums/gender.enum'
import { clearTable } from '../util/util'
import { USERS_TABLE } from './constants/user.constant'

jest.mock('./user.event.controller')

let v1UserController: V1UserController
let userService: V1UserService
let userRepository: UserRepository
let typeORMConnection: TypeORMConnection
let rabbitMQConnection: AmqpConnection

describe('test V1UserController', () => {
  beforeAll(async (done) => {
    // init connection and model
    typeORMConnection = await typeORMCreateConnection(typeOrmConfig);
    rabbitMQConnection= await amqpCreateConnection(
      `amqp://${process.env.RABBITMQ_USER_NAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_MAPPING_PORT}`
    );
    userRepository = getConnection(process.env.POSTGRESQL_CONNECTION_NAME).getCustomRepository(UserRepository);
    userService = new V1UserService(userRepository,rabbitMQConnection);
    v1UserController = new V1UserController(userService);

    // need assign test environment, protect other environment data
    expect(process.env.NODE_ENV).toMatch(/^test$|^ci$/)
    done()
  });

  afterAll(async() =>{
    await clearTable(typeORMConnection, USERS_TABLE);
    typeORMConnection.close();
    rabbitMQConnection.close();
  });

  it('test findUserById', async (done) => {
    // create mock data
    await clearTable(typeORMConnection, USERS_TABLE);
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
