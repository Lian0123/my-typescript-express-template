import { Connection, getConnection } from 'typeorm'
import { UserRepository } from '../users/repositories/user.repository'
import { Container } from 'inversify'
import { containerBinding } from '../container'
import { InversifyExpressServer } from 'inversify-express-utils'
import express from 'express'
import request from 'supertest'
import { GenderEnum } from '../users/enums/gender.enum'
import { clearTable } from '../util/util'
import { USERS_TABLE } from '../users/constants/user.constant';


let app: express.Application
let userRepository: UserRepository
let connection: Connection


describe('GET /hello', () => {
  beforeAll(async (done) => {
    // init server
    const container = new Container()
    await container.loadAsync(containerBinding)
    const server = new InversifyExpressServer(container)
    app = server.build()
    
    // init connection and model
    connection = getConnection(process.env.POSTGRESQL_CONNECTION_NAME);
    userRepository = connection.getCustomRepository(UserRepository);

    // need assign test environment, protect other environment data
    expect(process.env.NODE_ENV).toMatch(/^test$|^ci$/)
    done()
  })
  
  afterAll(async() =>{
    await clearTable(connection, USERS_TABLE);
    connection.close();
  });

  it('/v1/users/1', async (done) => {
    // create mock data
    await clearTable(connection, USERS_TABLE);
    await userRepository.save({
      id: 1,
      gender: GenderEnum.MALE,
      name: 'josh',
    })

    request(app)
      .get('/v1/users/1')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(err).toBeNull()
        expect(res.body?.id).toBe(1)
        done()
      })
  })
})
