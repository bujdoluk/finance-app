import type { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('pots', {
      id: 'id', 
      name: { type: 'text', notNull: true, unique: true },
      theme: { type: 'text', notNull: true },
      target: { type: 'numeric', notNull: true },
      amount: { type: 'numeric', notNull: true, default: 0 },
      total_saved: { type: 'numeric', notNull: true, default: 0 },
      created_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') },
      updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') },
      deleted_at: { type: 'timestamptz', default: null },
    },
    { ifNotExists: true }
  );

  pgm.createIndex('pots', 'name');
  pgm.createIndex('pots', 'theme');
  pgm.createIndex('pots', 'created_at');

  pgm.sql(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER pots_set_updated_at
    BEFORE UPDATE ON pots
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTrigger('pots', 'pots_set_updated_at');
  pgm.dropFunction('set_updated_at', []); 
  pgm.dropIndex('pots', 'name');
  pgm.dropIndex('pots', 'theme');
  pgm.dropIndex('pots', 'created_at');
  pgm.dropTable('pots', { ifExists: true });
}
