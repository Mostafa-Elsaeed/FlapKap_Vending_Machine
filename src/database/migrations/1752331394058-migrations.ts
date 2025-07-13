import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1752331394058 implements MigrationInterface {
    name = 'Migrations1752331394058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "vending_machine"."users_role_enum" AS ENUM('buyer', 'seller')`);
        await queryRunner.query(`CREATE TABLE "vending_machine"."users" ("createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "email" character varying NOT NULL, "hashPassword" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "role" "vending_machine"."users_role_enum" NOT NULL DEFAULT 'seller', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "vending_machine"."users"`);
        await queryRunner.query(`DROP TYPE "vending_machine"."users_role_enum"`);
    }

}
