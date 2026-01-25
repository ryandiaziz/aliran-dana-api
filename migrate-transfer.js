import pool from './configs/database-config.js';

const migrate = async () => {
    try {
        console.log('Starting migration...');

        // 1. Add 'transfer' to ENUM
        // Postgres cannot natively ALTER TYPE ... ADD VALUE inside a transaction block easily in some versions, 
        // but we'll try independent execution or catch error if exists.
        try {
            await pool.query("ALTER TYPE category_type ADD VALUE 'transfer';");
            console.log("Added 'transfer' to category_type.");
        } catch (e) {
            console.log("Skipping ENUM update (might already exist or error):", e.message);
        }

        // 2. Add destination_account_id to transactions
        try {
            await pool.query(`
                ALTER TABLE transactions 
                ADD COLUMN IF NOT EXISTS destination_account_id int NULL;
            `);
             console.log("Added column 'destination_account_id'.");
        } catch (e) {
             console.error("Error adding column:", e.message);
        }
       
        // 3. Add Foreign Key
        try {
            await pool.query(`
                ALTER TABLE transactions 
                DROP CONSTRAINT IF EXISTS transactions_destination_fk;
                
                ALTER TABLE transactions 
                ADD CONSTRAINT transactions_destination_fk 
                FOREIGN KEY (destination_account_id) 
                REFERENCES public.accounts(account_id) 
                ON DELETE CASCADE ON UPDATE CASCADE;
            `);
            console.log("Added Foreign Key constraint.");
        } catch (e) {
            console.error("Error adding Foreign Key:", e.message);
        }

        console.log('Migration completed.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
