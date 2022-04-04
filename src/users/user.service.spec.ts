import { createConnection as typeORMCreateConnection, Connection as TypeORMConnection, getConnection } from 'typeorm'
import { connect as amqpCreateConnection, Connection as AmqpConnection } from 'amqplib'
import { typeOrmConfig } from '../typeorm-config'
import { V1UserService } from './user.service'
import { UserRepository } from './repositories/user.repository'
import { GenderEnum } from './enums/gender.enum'
import { clearTable } from '../util/util'
import { USERS_TABLE } from './constants/user.constant';

jest.mock('./user.event.controller')

let userService: V1UserService
let typeORMConnection: TypeORMConnection
let rabbitMQConnection: AmqpConnection
let userRepository: UserRepository

describe('test userService', () => {
  beforeAll(async (done) => {
    typeORMConnection = await typeORMCreateConnection(typeOrmConfig);
    rabbitMQConnection= await amqpCreateConnection(
      `amqp://${process.env.RABBITMQ_USER_NAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_MAPPING_PORT}`
    );
    userRepository = getConnection(process.env.POSTGRESQL_CONNECTION_NAME).getCustomRepository(UserRepository)
    userService = new V1UserService(userRepository,rabbitMQConnection)
    
    // need assign test environment, protect other environment data
    expect(process.env.NODE_ENV).toMatch(/^test$|^ci$/)
    done()
  })

  afterAll(async() =>{
    // truncate table data
    await clearTable(typeORMConnection, USERS_TABLE);
    typeORMConnection.close();
    rabbitMQConnection.close();
  });

  it('test findOneUserById', async (done) => {
    // create mock data
    await clearTable(typeORMConnection, USERS_TABLE);
    await userRepository.save({
      id: 1,
      gender: GenderEnum.MALE,
      name: 'josh',
    })

    const user = await userService.findOneUserById(1)
    expect(user?.name).toBe('josh')
    done()
  })

})
