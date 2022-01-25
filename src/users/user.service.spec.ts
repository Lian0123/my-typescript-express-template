import { Connection, createConnection, getConnection } from 'typeorm'
import { typeOrmConfig } from '../typeorm-config'
import { V1UserService } from './user.service'
import { UserRepository } from './repositories/user.repository'
import { GenderEnum } from './enums/gender.enum'
import { clearTable } from '../util/util'
import { USERS_TABLE } from './constants/user.constant';

let userService: V1UserService
let connection: Connection
let userRepository: UserRepository

describe('test userService', () => {
  beforeAll(async (done) => {
    connection = await createConnection(typeOrmConfig)
    userRepository = getConnection(process.env.POSTGRESQL_CONNECTION_NAME).getCustomRepository(UserRepository)
    userService = new V1UserService(userRepository)
    
    // need assign test environment, protect other environment data
    expect(process.env.NODE_ENV).toMatch(/^test$|^ci$/)
    done()
  })

  afterAll(async() =>{
    // truncate table data
    await clearTable(connection, USERS_TABLE);
    connection.close();
  });

  it('test findOneUserById', async (done) => {
    // create mock data
    await clearTable(connection, USERS_TABLE);
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
