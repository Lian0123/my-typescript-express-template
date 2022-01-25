import { Connection } from "typeorm";

// HACK Now only support PostgresQL, MySQL, Mariadb database query
export async function clearTable(connection: Connection, table: string) {
    const selectDatabase = connection.options.type;
    await connection.query(`TRUNCATE TABLE ${table}`);

    if( selectDatabase === 'postgres' ) {
        await connection.query(`ALTER SEQUENCE ${table}_id_seq RESTART WITH 1`);
    }else if( selectDatabase === 'mysql' || selectDatabase === 'mariadb' ){
        await connection.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
    }else{
        throw 'Not defined database type, please update /util.ts clearTable function'
    }
}
