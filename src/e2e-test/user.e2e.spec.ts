import request from 'supertest'
import { Container } from 'inversify'
import { containerBinding } from '../container'
import { InversifyExpressServer } from 'inversify-express-utils'
import express from 'express'

let app: express.Application
beforeAll(async () => {
  const container = new Container()
  await container.loadAsync(containerBinding)
  const server = new InversifyExpressServer(container)
  app = server.build()
})

describe('GET /hello', () => {
  it('/v1/users/1', async (done) => {
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
