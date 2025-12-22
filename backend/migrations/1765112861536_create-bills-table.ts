import type { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('bills', {
      id: 'id',
      name: { type: 'text', notNull: true, unique: true },
      amount: { type: 'numeric', notNull: true },
      frequency: { type: 'text', notNull: false },
      due_date: { type: 'timestamptz', notNull: true },
      created_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') },
      updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') },
      deleted_at: { type: 'timestamptz', default: null },
    },
    { ifNotExists: true }
  );

  pgm.createIndex('bills', 'name');
  pgm.createIndex('bills', 'due_date');
  pgm.createIndex('bills', 'created_at');

  pgm.sql(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER bills_set_updated_at
    BEFORE UPDATE ON bills
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTrigger('bills', 'bills_set_updated_at');
  pgm.dropFunction('set_updated_at', []); 
  pgm.dropIndex('bills', 'name');
  pgm.dropIndex('bills', 'due_date');
  pgm.dropIndex('bills', 'created_at');
  pgm.dropTable('bills', { ifExists: true });
}
