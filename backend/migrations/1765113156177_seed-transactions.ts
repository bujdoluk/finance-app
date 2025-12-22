import type { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    INSERT INTO transactions (amount, category, transaction_type, sender, sender_picture, date)
    VALUES
      (100, 'Food', 'expense', 'John Doe', 'https://example.com/john.png', NOW() - INTERVAL '3 days'),
      (250, 'Travel', 'expense', 'Jane Smith', 'https://example.com/jane.png', NOW() - INTERVAL '10 days'),
      (50, 'Entertainment', 'expense', 'Bob Lee', NULL, NOW() - INTERVAL '1 day'),
      (2000, 'General', 'income', 'Employer', NULL, NOW() - INTERVAL '15 days')
    ON CONFLICT (id) DO NOTHING;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DELETE FROM transactions
    WHERE sender IN ('John Doe', 'Jane Smith', 'Bob Lee', 'Employer');
  `);
}
