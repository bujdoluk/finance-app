import type { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    INSERT INTO pots (name, theme, target, amount, total_saved)
    VALUES
      ('Vacation Fund', '#626070', 2000, 0, 0),
      ('Emergency Fund', '#597C7C', 5000, 0, 0),
      ('New Laptop', '#7F9161', 1500, 0, 0)
    ON CONFLICT (name) DO NOTHING;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DELETE FROM pots
    WHERE name IN ('Vacation Fund', 'Emergency Fund', 'New Laptop');
  `);
}
