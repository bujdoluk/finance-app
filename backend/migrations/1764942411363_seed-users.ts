import type { MigrationBuilder } from 'node-pg-migrate';

export const shorthands: undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`
      INSERT INTO users (first_name, last_name, email, password, created_at, updated_at, deleted_at)
      VALUES (
        'John',
        'Doe',
        'john@example.com',
        'secret123',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        null
      );
    `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`DELETE FROM users WHERE email = 'john@example.com';`);
}
