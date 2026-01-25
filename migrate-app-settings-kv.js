import pool from './configs/database-config.js';

const migrateAppSettings = async () => {
    try {
        console.log('Starting App Settings KV Migration...');

        // 1. Drop Old Table
        await pool.query(`DROP TABLE IF EXISTS app_settings CASCADE`);
        console.log('Dropped old app_settings table.');

        // 2. Create New Table
        await pool.query(`
            CREATE TABLE public.app_settings (
                setting_id serial NOT NULL,
                setting_key varchar(255) NOT NULL,
                setting_value text NULL,
                setting_type varchar(50) DEFAULT 'string',
                created_at timestamp DEFAULT NOW() NOT NULL,
                updated_at timestamp DEFAULT NOW() NOT NULL,
                CONSTRAINT app_settings_pk PRIMARY KEY (setting_id),
                CONSTRAINT app_settings_key_un UNIQUE (setting_key)
            );
        `);
        console.log('Created new app_settings table (Key-Value).');

        // 3. Seed Default Data
        const defaults = [
            { key: 'app_name', value: 'Aliran Dana', type: 'string' },
            { key: 'app_logo', value: '', type: 'string' },
            { key: 'maintenance_mode', value: 'false', type: 'boolean' },
            { key: 'currency_symbol', value: 'Rp', type: 'string' },
            { key: 'is_registration_open', value: 'true', type: 'boolean' },
            { key: 'max_users', value: '10000', type: 'number' }
        ];

        for (const def of defaults) {
            await pool.query(`
                INSERT INTO app_settings(setting_key, setting_value, setting_type, created_at, updated_at)
                VALUES($1, $2, $3, NOW(), NOW())
            `, [def.key, def.value, def.type]);
        }
        console.log('Seeded default settings.');

        console.log('Migration completed.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateAppSettings();
