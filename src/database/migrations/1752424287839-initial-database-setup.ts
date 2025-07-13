import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDatabaseSetup1752424287839 implements MigrationInterface {
  name = 'InitialDatabaseSetup1752424287839';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vending_machine"."products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productName" character varying NOT NULL, "cost" integer NOT NULL, "amountAvailable" integer NOT NULL, "sellerId" uuid, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "vending_machine"."users_role_enum" AS ENUM('buyer', 'seller')`,
    );
    await queryRunner.query(
      `CREATE TABLE "vending_machine"."users" ("createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "email" character varying NOT NULL, "hashPassword" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "role" "vending_machine"."users_role_enum" NOT NULL DEFAULT 'seller', "deposit" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vending_machine"."transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "totalSpent" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "buyerId" uuid, "productId" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "vending_machine"."products" ADD CONSTRAINT "FK_e40a1dd2909378f0da1f34f7bd6" FOREIGN KEY ("sellerId") REFERENCES "vending_machine"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vending_machine"."transactions" ADD CONSTRAINT "FK_ec4767e5beacbc7dfaa507d1fc6" FOREIGN KEY ("buyerId") REFERENCES "vending_machine"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vending_machine"."transactions" ADD CONSTRAINT "FK_5642b5bed5c9404a1424df580f1" FOREIGN KEY ("productId") REFERENCES "vending_machine"."products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vending_machine"."transactions" DROP CONSTRAINT "FK_5642b5bed5c9404a1424df580f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vending_machine"."transactions" DROP CONSTRAINT "FK_ec4767e5beacbc7dfaa507d1fc6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vending_machine"."products" DROP CONSTRAINT "FK_e40a1dd2909378f0da1f34f7bd6"`,
    );
    await queryRunner.query(`DROP TABLE "vending_machine"."transactions"`);
    await queryRunner.query(`DROP TABLE "vending_machine"."users"`);
    await queryRunner.query(`DROP TYPE "vending_machine"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "vending_machine"."products"`);
  }
}
