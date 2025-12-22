import type { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    INSERT INTO budgets (name, theme, amount, maximum_spending)
    VALUES
      ('Groceries', '#82C9D7', 500, 500),
      ('Vacation', '#934F6F', 1000, 1000)
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DELETE FROM budgets
    WHERE name IN ('Groceries', 'Vacation');
  `);
}
