import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1703520000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tabla de usuarios
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('admin', 'staff');
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "username" VARCHAR NOT NULL,
        "password" VARCHAR NOT NULL,
        "fullName" VARCHAR NOT NULL,
        "email" VARCHAR,
        "role" "user_role_enum" NOT NULL DEFAULT 'staff',
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Crear usuario administrador por defecto
    await queryRunner.query(`
      INSERT INTO "users" ("username", "password", "fullName", "role")
      VALUES ('admin', '$2b$10$9OgWBnqBGcP8dGC4jNZNWePgvLrML7Wo4Y7OlwgcdQrFepcV6P8tC', 'Administrador', 'admin')
    `); // La contraseña es 'admin123' hasheada con bcrypt

    // Tabla de configuraciones generales
    await queryRunner.query(`
      CREATE TABLE "general_config" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "nombre_entidad" VARCHAR NOT NULL,
        "propietario" VARCHAR NOT NULL,
        "numero_id" VARCHAR NOT NULL,
        "direccion" VARCHAR NOT NULL,
        "telefono" VARCHAR NOT NULL,
        "correo" VARCHAR NOT NULL,
        "redes_sociales" JSON,
        "numero_inicio_facturas" INTEGER NOT NULL DEFAULT 1,
        "texto_facturas" TEXT,
        "pie_facturas" TEXT,
        CONSTRAINT "PK_general_config" PRIMARY KEY ("id")
      )
    `);

    // Tabla de mesas
    await queryRunner.query(`
      CREATE TABLE "tables" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "number" INTEGER NOT NULL,
        "name" VARCHAR NOT NULL,
        "description" VARCHAR,
        "isOccupied" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        CONSTRAINT "PK_tables" PRIMARY KEY ("id")
      )
    `);

    // Tabla de clientes
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "name" VARCHAR NOT NULL,
        "tableId" UUID NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        CONSTRAINT "PK_customers" PRIMARY KEY ("id"),
        CONSTRAINT "FK_customers_tables" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // Tabla de productos
    await queryRunner.query(`
      CREATE TYPE "product_type_enum" AS ENUM ('food', 'beverage', 'other');
    `);

    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "name" VARCHAR NOT NULL,
        "description" VARCHAR,
        "price" DECIMAL(10,2) NOT NULL,
        "stock" INTEGER NOT NULL DEFAULT 0,
        "type" "product_type_enum" NOT NULL DEFAULT 'other',
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        CONSTRAINT "PK_products" PRIMARY KEY ("id")
      )
    `);

    // Tabla de órdenes
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "tableId" UUID NOT NULL,
        "clientId" UUID,
        "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
        "status" VARCHAR NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        CONSTRAINT "PK_orders" PRIMARY KEY ("id"),
        CONSTRAINT "FK_orders_tables" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_orders_customers" FOREIGN KEY ("clientId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `);

    // Tabla de ítems de órdenes
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "orderId" UUID NOT NULL,
        "productId" UUID NOT NULL,
        "quantity" INTEGER NOT NULL,
        "unitPrice" DECIMAL(10,2) NOT NULL,
        "subtotal" DECIMAL(10,2) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_order_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_items_orders" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_order_items_products" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // Tabla de solicitudes de órdenes
    await queryRunner.query(`
      CREATE TABLE "order_requests" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "tableId" UUID NOT NULL,
        "clientId" UUID,
        "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "isCompleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "PK_order_requests" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_requests_tables" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_order_requests_customers" FOREIGN KEY ("clientId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `);

    // Tabla de ítems de solicitudes de órdenes
    await queryRunner.query(`
      CREATE TABLE "order_request_items" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "orderRequestId" UUID NOT NULL,
        "productId" UUID NOT NULL,
        "quantity" INTEGER NOT NULL,
        "unitPrice" DECIMAL(10,2) NOT NULL,
        "subtotal" DECIMAL(10,2) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_order_request_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_request_items_order_requests" FOREIGN KEY ("orderRequestId") REFERENCES "order_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_order_request_items_products" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // Tabla de solicitudes de canciones
    await queryRunner.query(`
      CREATE TABLE "song_requests" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "songName" VARCHAR NOT NULL,
        "tableId" UUID NOT NULL,
        "clientId" UUID,
        "isKaraoke" BOOLEAN NOT NULL DEFAULT false,
        "isPlayed" BOOLEAN NOT NULL DEFAULT false,
        "orderInRound" INTEGER NOT NULL,
        "roundNumber" INTEGER NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        CONSTRAINT "PK_song_requests" PRIMARY KEY ("id"),
        CONSTRAINT "FK_song_requests_tables" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_song_requests_customers" FOREIGN KEY ("clientId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar tablas en orden inverso para mantener la integridad referencial
    await queryRunner.query(`DROP TABLE "song_requests"`);
    await queryRunner.query(`DROP TABLE "order_request_items"`);
    await queryRunner.query(`DROP TABLE "order_requests"`);
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TYPE "product_type_enum"`);
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(`DROP TABLE "tables"`);
    await queryRunner.query(`DROP TABLE "general_config"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
} 