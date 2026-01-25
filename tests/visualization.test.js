import request from 'supertest';
import app from '../index.js';
import pool from '../configs/database-config.js';

describe('Visualization API Integration Tests', () => {
    let authToken;
    let userId;
    let accountId;
    let categoryFoodId;
    let categorySalaryId;

    const testUser = {
        username: 'viz_user_' + Date.now(),
        email: `viz${Date.now()}@example.com`,
        password: 'password123'
    };

    beforeAll(async () => {
        // 1. Setup User
        const regRes = await request(app).post('/api/users').send(testUser);
        userId = regRes.body.response.data.user_id;

        const loginRes = await request(app).post('/api/users/login').send({
            email: testUser.email,
            password: testUser.password
        });
        authToken = loginRes.body.response.data;

        // 2. Setup Account
        const acc = await request(app).post('/api/accounts')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ account_name: 'Main Bank', account_balance: 1000000 });
        accountId = acc.body.response.data.account_id;

        // 3. Setup Categories (Using Global if available, or create new)
        // Let's create specific ones for testing aggregation
        const cat1 = await request(app).post('/api/categories')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ category_name: 'Food Viz', category_type: 'expense' });
        categoryFoodId = cat1.body.response.data.category_id;

        const cat2 = await request(app).post('/api/categories')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ category_name: 'Salary Viz', category_type: 'income' });
        categorySalaryId = cat2.body.response.data.category_id;

        // 4. Seed Transactions
        // Expense: Food Viz - 50,000
        await request(app).post('/api/transactions')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                transaction_note: 'Lunch',
                transaction_amount: 50000,
                transaction_type: 'expense',
                transaction_date: new Date().toISOString(), // Today
                category_id: categoryFoodId,
                account_id: accountId
            });

        // Expense: Food Viz - 25,000 (Same category to test sum)
        await request(app).post('/api/transactions')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                transaction_note: 'Dinner',
                transaction_amount: 25000,
                transaction_type: 'expense',
                transaction_date: new Date().toISOString(),
                category_id: categoryFoodId,
                account_id: accountId
            });
        
        // Income: Salary - 5,000,000
        await request(app).post('/api/transactions')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                transaction_note: 'Monthly Salary',
                transaction_amount: 5000000,
                transaction_type: 'income',
                transaction_date: new Date().toISOString(),
                category_id: categorySalaryId,
                account_id: accountId
            });
    });

    afterAll(async () => {
        if (userId) {
            await pool.query('DELETE FROM users WHERE user_id = $1', [userId]);
        }
    });

    describe('GET /api/transactions/summary/category', () => {
        it('should return total expense per category', async () => {
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1); // 1 month ago
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1); // 1 month future

            const res = await request(app)
                .get('/api/transactions/summary/category')
                .query({ 
                    start_date: startDate.toISOString(), 
                    end_date: endDate.toISOString(),
                    type: 'expense'
                })
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toEqual(200);
            const data = res.body.response.data;
            
            // Should have 'Food Viz' with total 75,000
            const foodStats = data.find(d => d.category_name === 'Food Viz');
            expect(foodStats).toBeDefined();
            expect(parseInt(foodStats.total)).toBe(75000);
        });
    });

    describe('GET /api/transactions/summary/trend', () => {
        it('should return monthly trend', async () => {
            const res = await request(app)
                .get('/api/transactions/summary/trend')
                .query({ year: new Date().getFullYear() })
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toEqual(200);
            const data = res.body.response.data;
            
            // Find current month
            const currentMonth = new Date().getMonth() + 1; // 1-indexed (Postgres EXTRACT returns 1-12)
            const monthStats = data.find(d => parseInt(d.month) === currentMonth);
            
            expect(monthStats).toBeDefined();
            expect(parseInt(monthStats.total_income)).toBe(5000000);
            expect(parseInt(monthStats.total_expense)).toBe(75000);
        });
    });
});
