import pool from './configs/database-config.js';

const migrateGlobalCategories = async () => {
    try {
        console.log('Starting Global Categories Migration...');

        // 1. Alter Column user_id to be NULLable
        await pool.query(`
            ALTER TABLE categories 
            ALTER COLUMN user_id DROP NOT NULL;
        `);
        console.log('Modified user_id to be NULLable.');

        // 2. Seed Initial Global Data
        const globalCats = [
            { name: 'Biaya Admin', type: 'expense' },
            { name: 'Makan & Minum', type: 'expense' },
            { name: 'Transportasi', type: 'expense' },
            { name: 'Gaji', type: 'income' },
            { name: 'Transfer Masuk', type: 'transfer' }, // Useful for labeling generic transfers
            { name: 'Transfer Keluar', type: 'transfer' }
        ];

        for (const cat of globalCats) {
            // Check if exists to avoid duplicates (based on name + null user_id)
            const check = await pool.query(`SELECT category_id FROM categories WHERE category_name = $1 AND user_id IS NULL`, [cat.name]);
            if (check.rowCount === 0) {
                 await pool.query(`
                    INSERT INTO categories(category_name, category_type, user_id, created_at, updated_at) 
                    VALUES($1, $2, NULL, NOW(), NOW())
                `, [cat.name, cat.type]);
                console.log(`Inserted global category: ${cat.name}`);
            } else {
                console.log(`Skipped existing global category: ${cat.name}`);
            }
        }

        console.log('Migration completed.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateGlobalCategories();
