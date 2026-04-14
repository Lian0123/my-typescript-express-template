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
    'src/**/*.entity.ts',
    'dist/**/*.entity.js'
  ],
  migrations: [
    'src/migrations/**/*.ts',
    'dist/migrations/**/*.js'
  ],
  subscribers: [
    'src/subscribers/**/*.ts',
    'dist/subscribers/**/*.js'
  ],
};

