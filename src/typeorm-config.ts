/* Import Package */
import { ConnectionOptions } from 'typeorm';

/* Environment Variables */
import './env';
const {
  POSTGRESQL_HOST,
  POSTGRESQL_PORT,
  POSTGRESQL_USER_NAME,
  POSTGRESQL_PASSWORD,
  POSTGRESQL_DATABASE,
  POSTGRESQL_CONNECTION_NAME,
} = process.env;

export const typeOrmConfig: ConnectionOptions = {
  type: 'postgres',
  host: POSTGRESQL_HOST,
  port: parseInt(POSTGRESQL_PORT),
  username: POSTGRESQL_USER_NAME,
  password: POSTGRESQL_PASSWORD,
  database: POSTGRESQL_DATABASE,
  name: POSTGRESQL_CONNECTION_NAME,
  synchronize: true,
  logging: false,
  entities: [
    'src/accounts/entities/**/*.ts'
  ],
  migrations: [
    'src/migrations/**/*.ts'
  ],
  subscribers: [
    'src/subscribers/**/*.ts'
  ],
};

