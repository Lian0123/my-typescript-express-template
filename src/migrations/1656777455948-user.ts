import {MigrationInterface, QueryRunner, Table} from "typeorm";

const table = "users";

export class Users1656777455948 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name:table,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                },
                {
                    name: "name",
                    type: "varchar",
                },
                {
                    name: "gender",
                    type: "varchar",
                }
            ]
        })
        );
    }

}
