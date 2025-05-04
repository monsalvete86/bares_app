import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';

export class FixAdminPassword1746252527267 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Generamos un nuevo hash para la contraseña 'admin123'
        const password = 'admin123';
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Actualizamos la contraseña del usuario admin
        await queryRunner.query(`
            UPDATE "users"
            SET "password" = '${hashedPassword}'
            WHERE "username" = 'admin'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // La contraseña original hash del usuario admin
        const originalHashedPassword = '$2b$10$9OgWBnqBGcP8dGC4jNZNWePgvLrML7Wo4Y7OlwgcdQrFepcV6P8tC';
        
        // Revertimos a la contraseña original
        await queryRunner.query(`
            UPDATE "users"
            SET "password" = '${originalHashedPassword}'
            WHERE "username" = 'admin'
        `);
    }

}
