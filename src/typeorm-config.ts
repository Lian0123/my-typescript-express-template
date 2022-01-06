import { ConnectionOptions } from 'typeorm'
import './env'

export const typeOrmConfig: ConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRESQL_HOST,
  port: parseInt(process.env.POSTGRESQL_PORT),
  username: process.env.POSTGRESQL_USER_NAME,
  password: process.env.POSTGRESQL_PASSWORD,
  database: process.env.POSTGRESQL_DATABASE,
  name: process.env.POSTGRESQL_CONNECTION_NAME,
  synchronize: true,
  migrationsRun: true,
  logging: false,
  entities: [
    'src/users/entities/**/*.ts'
  ],
  migrations: [
    'src/migrations/**/*.ts'
  ],
  subscribers: [
    'src/subscribers/**/*.ts'
  ],
}

