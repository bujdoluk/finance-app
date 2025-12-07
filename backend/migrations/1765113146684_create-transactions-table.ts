import type { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('transactions', {
      id: 'id', 
      amount: { type: 'numeric', notNull: true },
      category: { type: 'text', notNull: true },
      sender: { type: 'text', notNull: true },
      sender_picture: { type: 'text', notNull: false },
      date: { type: 'timestamptz', notNull: true },
      created_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') },
      updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') },
      deleted_at: { type: 'timestamptz', default: null },
    },
    { ifNotExists: true }
  );

  pgm.createIndex('transactions', 'category');
  pgm.createIndex('transactions', 'sender');
  pgm.createIndex('transactions', 'date');

  pgm.sql(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER transactions_set_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTrigger('transactions', 'transactions_set_updated_at');
  pgm.dropFunction('set_updated_at', []); 
  pgm.dropIndex('transactions', 'category');
  pgm.dropIndex('transactions', 'sender');
  pgm.dropIndex('transactions', 'date');
  pgm.dropTable('transactions', { ifExists: true });
}
