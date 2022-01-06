import { Connection, createConnection, getConnection } from 'typeorm'
import { typeOrmConfig } from '../typeorm-config'
import { V1UserService } from './user.service'
import { UserRepository } from './repositories/user.repository'

let userService: V1UserService
let connection: Connection

describe('test userService', () => {
  beforeAll(async () => {
    connection = await createConnection(typeOrmConfig)
    userService = new V1UserService(getConnection(process.env.POSTGRESQL_CONNECTION_NAME).getCustomRepository(UserRepository))
  })

  it('test findOneUserById', async () => {
    try {
      const user = await userService.findOneUserById(1)
      expect(user?.name).toBe('josh')
    } catch (err) {
      console.log(err)
    }
  })

  afterAll(() => {
    connection.close()
  })
})
