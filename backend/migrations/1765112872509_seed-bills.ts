import type { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    INSERT INTO bills (name, amount, frequency, due_date, status)
    VALUES
      ('Electricity', 100, 'monthly', NOW() - INTERVAL '1 month', 'paid'),
      ('Internet', 50, 'monthly', NOW() - INTERVAL '1 month', 'due_soon'),
      ('Gym', 30, 'monthly', NOW() + INTERVAL '1 month', 'unpaid')
    ON CONFLICT (name) DO NOTHING;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DELETE FROM bills
    WHERE name IN ('Electricity', 'Internet', 'Gym');
  `);
}
