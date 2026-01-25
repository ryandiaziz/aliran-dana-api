import request from 'supertest';
import app from '../index.js';
import pool from '../configs/database-config.js';

describe('Global Categories Integration Tests', () => {
    let authToken;
    let userId;

    const testUser = {
        username: 'category_user_' + Date.now(),
        email: `category${Date.now()}@example.com`,
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
    });

    afterAll(async () => {
        if (userId) {
            await pool.query('DELETE FROM users WHERE user_id = $1', [userId]);
        }
    });

    it('should return global categories for a new user', async () => {
        const res = await request(app)
            .get('/api/categories')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.statusCode).toEqual(200);
        const categories = res.body.response.data;
        
        // Check for 'Biaya Admin' (seeded)
        const adminFee = categories.find(c => c.category_name === 'Biaya Admin');
        expect(adminFee).toBeDefined();
        expect(adminFee.user_id).toBeNull(); // Should be global

        // Check total global categories (we seeded 6)
        // We expect at least 6.
        expect(categories.length).toBeGreaterThanOrEqual(6);
    });
});
