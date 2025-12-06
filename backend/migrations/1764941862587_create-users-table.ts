import type { MigrationBuilder } from 'node-pg-migrate';

export const shorthands: undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('users', {
        id: 'id',
        first_name: { type: 'text', notNull: true },
        last_name: { type: 'text', notNull: true  },
        email: { type: 'text', notNull: true, unique: true },
        password: { type: 'text', notNull: true },
        created_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') },
        deleted_at: { type: 'timestamptz', default: null }
    },  
    {
      ifNotExists: true,
    });

    pgm.createIndex('users', 'email'); 
    pgm.createIndex('users', ['first_name', 'last_name']); 
    pgm.createIndex('users', 'created_at'); 

    pgm.sql(`
        CREATE OR REPLACE FUNCTION set_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER users_set_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION set_updated_at();
    `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('users', 'email');
    pgm.dropIndex('users', ['first_name', 'last_name']);
    pgm.dropIndex('users', 'created_at');

    pgm.dropTable('users', { ifExists: true });
}
