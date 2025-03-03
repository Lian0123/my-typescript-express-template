import Redis from 'ioredis';
import { env } from 'process';
const {
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
} = env;

export const redis = new Redis({
    port: REDIS_PORT,
    host: REDIS_HOST,
    password: REDIS_PASSWORD,
});