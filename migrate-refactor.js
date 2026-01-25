import pool from './configs/database-config.js';

const migrateRefactor = async () => {
    try {
        console.log('Starting Refactor Migration...');

        // 1. Create Transfers Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.transfers (
                transfer_id serial NOT NULL,
                source_account_id int NOT NULL,
                destination_account_id int NOT NULL,
                amount int NOT NULL,
                admin_fee int DEFAULT 0 NOT NULL,
                note varchar NULL,
                user_id int NOT NULL,
                created_at timestamp DEFAULT NOW() NOT NULL,
                updated_at timestamp DEFAULT NOW() NOT NULL,
                CONSTRAINT transfers_pk PRIMARY KEY (transfer_id),
                CONSTRAINT transfers_source_fk FOREIGN KEY (source_account_id) REFERENCES public.accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT transfers_dest_fk FOREIGN KEY (destination_account_id) REFERENCES public.accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT transfers_users_fk FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);
        console.log('Created transfers table.');

        // 2. Add transfer_id to Transactions (for linking)
        try {
            await pool.query(`
                ALTER TABLE transactions 
                ADD COLUMN IF NOT EXISTS transfer_id int NULL;
            `);
            
            await pool.query(`
                ALTER TABLE transactions 
                DROP CONSTRAINT IF EXISTS transactions_transfer_fk;

                ALTER TABLE transactions 
                ADD CONSTRAINT transactions_transfer_fk 
                FOREIGN KEY (transfer_id) 
                REFERENCES public.transfers(transfer_id) 
                ON DELETE CASCADE ON UPDATE CASCADE;
            `);
            console.log("Added transfer_id to transactions.");
        } catch (e) {
            console.error("Error modifying transactions table:", e.message);
        }

        console.log('Migration completed.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateRefactor();
