import { Connection, createConnection, getConnection } from 'typeorm'
import { getMockReq } from '@jest-mock/express'
import { typeOrmConfig } from '../typeorm-config'
import { V1UserController } from './user.controller'
import { V1UserService } from './user.service'
import { UserRepository } from './repositories/user.repository'

let v1UserController: V1UserController
let userService: V1UserService
let connection: Connection

describe('test V1UserController', () => {
  beforeAll(async () => {
    connection = await createConnection(typeOrmConfig)
    userService = new V1UserService(getConnection(process.env.POSTGRESQL_CONNECTION_NAME).getCustomRepository(UserRepository))
    v1UserController = new V1UserController(userService)
  })

  it('test findUserById', async () => {
    const request = getMockReq({
      params: {
        id: '1'
      }
    })
    try {
      const user = await v1UserController.findUserById(request)
      expect(user?.name).toBe('josh')
    } catch (err) {
      console.log(err)
    }
  })

  afterAll(() => {
    connection.close()
  })
})
