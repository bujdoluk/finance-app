import type { MigrationBuilder } from 'node-pg-migrate';

export const shorthands: undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('budgets', {
    id: 'id', 
    name: { type: 'text', notNull: true, unique: true },
    theme: { type: 'text', notNull: true },
    amount: { type: 'numeric', notNull: true }, 
    maximum_spending: { type: 'numeric', notNull: true },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') },
    deleted_at: { type: 'timestamptz', default: null }
  }, 
  { ifNotExists: true }
);

  pgm.createIndex('budgets', 'name');
  pgm.createIndex('budgets', 'created_at');

  pgm.sql(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER budgets_set_updated_at
    BEFORE UPDATE ON budgets
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTrigger('budgets', 'budgets_set_updated_at');
  pgm.dropFunction('set_updated_at', []);
  pgm.dropIndex('budgets', 'name');
  pgm.dropIndex('budgets', 'created_at');
  pgm.dropTable('budgets', { ifExists: true });
}
