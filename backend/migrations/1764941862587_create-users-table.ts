import type { MigrationBuilder } from 'node-pg-migrate';

export const shorthands: undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('users', {
        id: 'id',
        first_name: { type: 'text', notNull: true },
        last_name: { type: 'text', notNull: true  },
        email: { type: 'text', notNull: true, unique: true },
        password: { type: 'text', notNull: true },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
        deleted_at: { type: 'boolean', notNull: true, default: false }
    },  
    {
      ifNotExists: true,
    });

    pgm.createIndex('users', 'email'); 
    pgm.createIndex('users', ['first_name', 'last_name']); 
    pgm.createIndex('users', 'created_at'); 
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('users', 'email');
    pgm.dropIndex('users', ['first_name', 'last_name']);
    pgm.dropIndex('users', 'created_at');

    pgm.dropTable('users', { ifExists: true });
}
