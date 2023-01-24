/* Import Package */
import pino from 'pino';
import { Connection } from "typeorm";

/* Type Check */
import { validate } from 'class-validator';
import { ClassConstructor, plainToClass } from 'class-transformer';

const logger = pino();

// HACK Now only support PostgresQL, MySQL, Mariadb database query
export const clearTable = async (connection: Connection, table: string) :Promise<void> => {
    const selectDatabase = connection.options.type;
    await connection.query(`TRUNCATE TABLE ${table}`);

    if( selectDatabase === 'postgres' ) {
        await connection.query(`ALTER SEQUENCE ${table}_id_seq RESTART WITH 1`);
    }else if( selectDatabase === 'mysql' || selectDatabase === 'mariadb' ){
        await connection.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
    }else{
        throw 'Not defined database type, please update /util.ts clearTable function';
    }
};

export const validateClass = async <T, V>(cls: ClassConstructor<T>, plain: V) :Promise<T> => {
    const plainDTO = plainToClass(cls, plain);
    const validError = await validate(plainDTO as any);

    if (validError?.length) {
     throw validError[0];
    }
    return plainDTO;
};

export const objectToBuffer = (object: any) :Buffer => {
    if (object === undefined) {
        logger.info('not data updated');
        return;
    }
    return Buffer.from(JSON.stringify(object,null,4));
};

export const bufferToObject = (buffer: Buffer) :any => {
    return JSON.parse(buffer.toString());
};