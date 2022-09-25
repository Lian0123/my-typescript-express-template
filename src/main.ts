/* Import Package */
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as swagger from 'swagger-express-ts';
import pino from 'pino';
import httpPino from 'pino-http';
import { randomUUID } from 'crypto';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

/* Enum & Constant */
import { ErrorHandler } from './common/constants';

/* Inject Reference */
import 'reflect-metadata';

/* Config & Environment Variables */
import { containerBinding } from './container';
import './env';
const {
  SERVICE_NAME,
  SERVICE_VERSION,
  SERVICE_HOST,
  SERVICE_PORT
} = process.env;

(async () => {
  const container = new Container();
  await container.loadAsync(containerBinding);
  const server = new InversifyExpressServer(container);
  const logger = pino();

  server.setConfig((app : any) => {
    app.use('/api-docs', express.static('src/swagger'));
    app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));
    app.use(bodyParser.json());
    app.use(swagger.express(
      {
        definition: {
          info: {
            title: SERVICE_NAME,
            version: SERVICE_VERSION
          },
          externalDocs: {
            url: `${SERVICE_HOST}:${SERVICE_PORT}/api-docs`
          }
        }
      }
    ));
    // Overwrite Headers
    app.use((request: Request, response: Response, next: express.NextFunction) => {
      request.headers['requestId'] = randomUUID();
      next();
    });
    app.use(httpPino());

  });

  const app = server.build();

  app.listen(SERVICE_PORT, () => {
    logger.info('Server is running on port', parseInt(SERVICE_PORT));
  });

  app.use(ErrorHandler);
})();
