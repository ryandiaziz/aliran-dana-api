import request from 'supertest';
import app from '../index.js';
import pool from '../configs/database-config.js';

describe('User Routes Integration Tests', () => {
    let authToken;
    let userId;
    const testUser = {
        username: 'testuser_' + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: 'password123'
    };

    // Clean up after tests
    afterAll(async () => {
        if (userId) {
            await pool.query('DELETE FROM users WHERE user_id = $1', [userId]);
        }
        await pool.end();
    });

    describe('POST /api/users (Registration)', () => {
        it('should create a new user', async () => {
            const res = await request(app)
                .post('/api/users')
                .send(testUser);
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.response.data).toHaveProperty('user_id');
            expect(res.body.response.data.username).toBe(testUser.username);
            expect(res.body.response.data.email).toBe(testUser.email);
            
            userId = res.body.response.data.user_id;
        });
    });

    describe('POST /api/users/login', () => {
        it('should login and return a token', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.response.data).toBeDefined();
            authToken = res.body.response.data;
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should fail with invalid data (validation check)', async () => {
            const res = await request(app)
                .put(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    username: 'a', // too short
                    email: 'not-an-email'
                });
            
            expect(res.statusCode).toEqual(400); // Expecting Validation Error
        });

        it('should update user with valid data', async () => {
            const newUsername = 'update_' + Date.now();
            const res = await request(app)
                .put(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    username: newUsername
                });
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.response.data.username).toBe(newUsername);
        });
    });
});
