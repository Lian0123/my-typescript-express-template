import {MigrationInterface, QueryRunner,Table} from "typeorm";

const table = "roles";

export class roles1665716256390 implements MigrationInterface {

    
    public async up(queryRunner: QueryRunner): Promise<void> {
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
                    name: "isUnique",
                    default: false,
                    type: "boolean",
                },
                {
                    name: "assessStartAt",
                    type: "timestamp",
                },
                {
                    name: "assessEndAt",
                    type: "timestamp",
                },
                {
                    name: 'applyCount',
                    type: "int",
                },
                {
                    name: 'totalCount',
                    type: "int",
                },
                {
                    name: 'isDeleted',
                    default: false,
                    type: "boolean",
                },
                {
                    name: 'roles',
                    isArray: true,
                    type: "int",
                },
                {
                    name: 'status',
                    default: 0,
                    type: "int",
                    unsigned: true,
                },
                {
                    name: 'version',
                    default: 0,
                    type: "int",
                    unsigned: true,
                },
                {
                    name: 'createdAt',
                    type: "timestamp",
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: "timestamp",
                    default: 'now()',
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(table);
    }


}
