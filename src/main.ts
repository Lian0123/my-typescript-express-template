import * as bodyParser from 'body-parser'
import * as express from 'express'
import 'reflect-metadata'
import { Container } from 'inversify'
import { InversifyExpressServer } from 'inversify-express-utils'
import * as swagger from 'swagger-express-ts'
import { NextFunction, Request, Response } from 'express'
import { containerBinding } from './container'
import './env';

(async () => {
  const container = new Container()
  await container.loadAsync(containerBinding)
  const server = new InversifyExpressServer(container)

  server.setConfig((app : any) => {
    app.use('/api-docs', express.static('src/swagger'))
    app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'))
    app.use(bodyParser.json())
    app.use(swagger.express(
      {
        definition: {
          info: {
            title: 'express-api-template',
            version: '1.0.0'
          },
          externalDocs: {
            url: `http://${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}/api-docs`
          }
        }
      }
    ))
  })

  server.setErrorConfig((app : any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err : Error, request : Request, response : Response, next: NextFunction) => {
      console.error(err.stack)
      response.status(500).send('Something broke!')
    })
  })

  const app = server.build()
  app.listen(process.env.SERVICE_PORT, () => {
    console.log('Server is running on port', parseInt(process.env.SERVICE_PORT))
  })
})()
