import request from 'supertest';
import app from '../index.js';
import pool from '../configs/database-config.js';

describe('Refactored Transfer Integration Tests', () => {
    let authToken;
    let userId;
    let accountSourceId;
    let accountDestId;
    let categoryId;

    const testUser = {
        username: 'refactor_user_' + Date.now(),
        email: `refactor${Date.now()}@example.com`,
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

        // Create Category for Transfer
        const cat = await request(app).post('/api/categories')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ category_name: 'Bank Transfer', category_type: 'expense' });
        categoryId = cat.body.response.data.category_id;
    });

    afterAll(async () => {
        if (userId) {
            await pool.query('DELETE FROM users WHERE user_id = $1', [userId]);
        }
    });

    describe('POST /api/transfers', () => {
        it('should successfully transfer funds with admin fee', async () => {
            const transferAmount = 100000;
            const adminFee = 5000;

            const res = await request(app)
                .post('/api/transfers')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    source_account_id: accountSourceId,
                    destination_account_id: accountDestId,
                    amount: transferAmount,
                    admin_fee: adminFee,
                    note: 'Transfer with Fee',
                    transaction_date: new Date().toISOString(),
                    category_id: categoryId
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.response.data.transfer_id).toBeDefined();

            // Verify Balances
            const sourceAcc = await request(app).get(`/api/accounts/${accountSourceId}`).set('Authorization', `Bearer ${authToken}`);
            const destAcc = await request(app).get(`/api/accounts/${accountDestId}`).set('Authorization', `Bearer ${authToken}`);

            // Logic: Initial (1,000,000) - Transfer (100,000) - Fee (5,000) = 895,000
            expect(parseInt(sourceAcc.body.response.data.account_balance)).toBe(895000);
            
            // Logic: Initial (0) + Transfer (100,000) = 100,000
            expect(parseInt(destAcc.body.response.data.account_balance)).toBe(100000);
        });

        it('should fail if destination same as source', async () => {
            const res = await request(app)
                .post('/api/transfers')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    source_account_id: accountSourceId,
                    destination_account_id: accountSourceId, // Same ID
                    amount: 50000,
                    transaction_date: new Date().toISOString(),
                    category_id: categoryId
                });
            
            expect(res.statusCode).toEqual(400); // Validation error
        });
    });
});
