import { MigrationInterface, QueryRunner } from "typeorm";

export class AjusteGeneralConfigUnique1746498861032 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar si hay más de un registro en la tabla
        const recordsCount = await queryRunner.query(
            `SELECT COUNT(*) as count FROM general_config`
        );
        
        const count = parseInt(recordsCount[0].count);
        
        // Si hay más de un registro, mantener solo el más antiguo
        if (count > 1) {
            // Identificar el registro más antiguo (el primero creado)
            const oldestRecord = await queryRunner.query(
                `SELECT id FROM general_config ORDER BY created_at ASC LIMIT 1`
            );
            
            // Eliminar todos los demás registros
            if (oldestRecord && oldestRecord.length > 0) {
                await queryRunner.query(
                    `DELETE FROM general_config WHERE id != $1`,
                    [oldestRecord[0].id]
                );
            }
        }
        
        // Agregar una restricción CHECK para asegurar que solo pueda existir un registro
        // Para esto, usamos una columna especial "is_singleton" que siempre debe ser true
        await queryRunner.query(`
            ALTER TABLE general_config ADD COLUMN IF NOT EXISTS is_singleton BOOLEAN NOT NULL DEFAULT true;
            CREATE UNIQUE INDEX IF NOT EXISTS idx_general_config_singleton ON general_config (is_singleton) WHERE is_singleton = true;
        `);
        
        // Agregar un comentario a la tabla para documentar el propósito
        await queryRunner.query(`
            COMMENT ON TABLE general_config IS 'Configuración general del bar. Esta tabla solo debe contener un único registro.';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar la restricción y la columna agregada
        await queryRunner.query(`
            DROP INDEX IF EXISTS idx_general_config_singleton;
            ALTER TABLE general_config DROP COLUMN IF EXISTS is_singleton;
        `);
    }
}
