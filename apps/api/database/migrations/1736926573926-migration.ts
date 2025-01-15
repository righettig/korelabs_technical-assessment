import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductProperties736926573926 implements MigrationInterface {
    name = 'AddProductProperties1736926573926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "value" character varying NOT NULL, "productId" uuid, CONSTRAINT "PK_c51d81a7e32d11a7b59c13192cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "properties"`);
        await queryRunner.query(`ALTER TABLE "product_properties" ADD CONSTRAINT "FK_cffc9e18f85a8d8173e5d835ee3" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_properties" DROP CONSTRAINT "FK_cffc9e18f85a8d8173e5d835ee3"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "properties" jsonb`);
        await queryRunner.query(`DROP TABLE "product_properties"`);
    }

}
