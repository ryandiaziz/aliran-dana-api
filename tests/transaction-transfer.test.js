import request from 'supertest';
import app from '../index.js';
import pool from '../configs/database-config.js';

describe('Transaction Transfer Integration Tests', () => {
    let authToken;
    let userId;
    let accountSourceId;
    let accountDestId;
    let categoryId;

    const testUser = {
        username: 'transfer_user_' + Date.now(),
        email: `transfer${Date.now()}@example.com`,
        password: 'password123'
    };

    beforeAll(async () => {
        // Register & Login
        const regRes = await request(app).post('/api/users').send(testUser);
        userId = regRes.body.response.data.user_id;

        const loginRes = await request(app).post('/api/users/login').send({
            email: testUser.email,
            password: testUser.password
        });
        authToken = loginRes.body.response.data;

        // Create Accounts
        const acc1 = await request(app).post('/api/accounts')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ account_name: 'Source Bank', account_balance: 1000000 });
        accountSourceId = acc1.body.response.data.account_id;

        const acc2 = await request(app).post('/api/accounts')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ account_name: 'Dest Wallet', account_balance: 0 });
        accountDestId = acc2.body.response.data.account_id;

        // Create Category (Transfer type needed?) 
        // Note: Transaction table stores category_id, but for transfer logic we might just pick any category or a specific 'Transfer' category.
        // For now, let's create a dummy category.
        const cat = await request(app).post('/api/categories')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ category_name: 'General Transfer', category_type: 'expense' }); // Temporary type
        categoryId = cat.body.response.data.category_id;
    });

    afterAll(async () => {
        if (userId) {
            await pool.query('DELETE FROM users WHERE user_id = $1', [userId]);
        }
        // pool.end() might be handled by other tests or global setup, but good to ensure close if standalone.
        // await pool.end(); 
    });

    describe('POST /api/transactions (Transfer)', () => {
        it('should fail if destination_account_id is missing for transfer', async () => {
            const res = await request(app)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    transaction_note: 'Fail Transfer',
                    transaction_amount: 50000,
                    transaction_type: 'transfer',
                    transaction_date: new Date().toISOString(),
                    category_id: categoryId,
                    account_id: accountSourceId
                    // destination_account_id missing
                });
            
            expect(res.statusCode).toEqual(400); 
            // Expect validation error from Joi
        });

        it('should successfully transfer funds', async () => {
            const transferAmount = 100000;
            const res = await request(app)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    transaction_note: 'Test Transfer',
                    transaction_amount: transferAmount,
                    transaction_type: 'transfer',
                    transaction_date: new Date().toISOString(),
                    category_id: categoryId,
                    account_id: accountSourceId,
                    destination_account_id: accountDestId
                });

            expect(res.statusCode).toEqual(200);
            
            // Verify Balances
            const sourceAcc = await request(app).get(`/api/accounts/${accountSourceId}`).set('Authorization', `Bearer ${authToken}`);
            const destAcc = await request(app).get(`/api/accounts/${accountDestId}`).set('Authorization', `Bearer ${authToken}`);

            // Initial: 1,000,000. Transfer: 100,000. Result: 900,000
            expect(parseInt(sourceAcc.body.response.data.account_balance)).toBe(900000);
            
            // Initial: 0. Transfer: 100,000. Result: 100,000
            expect(parseInt(destAcc.body.response.data.account_balance)).toBe(100000);
        });
    });
});
