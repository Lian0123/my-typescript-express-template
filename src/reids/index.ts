import Redis from 'ioredis';
import { env } from 'process';
const {
    REDIS_PORT
} = env;

export const redis = new Redis({
    port: REDIS_PORT,
});


