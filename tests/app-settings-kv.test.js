import request from 'supertest';
import app from '../index.js';
import pool from '../configs/database-config.js';

describe('App Settings (KV Store) Integration Tests', () => {
    let authToken;
    let userId;

    const testUser = {
        username: 'settings_user_' + Date.now(),
        email: `settings${Date.now()}@example.com`,
        password: 'password123'
    };

    beforeAll(async () => {
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
        // Cleanup settings created during test if needed
        await pool.query("DELETE FROM app_settings WHERE setting_key LIKE 'test_key_%'");
    });

    it('should get all settings as an object map', async () => {
        const res = await request(app).get('/api/app_settings');
        expect(res.statusCode).toEqual(200);
        
        const settings = res.body.response.data;
        expect(settings).toHaveProperty('app_name', 'Aliran Dana');
        expect(settings).toHaveProperty('maintenance_mode', false); // Boolean check
        expect(settings).toHaveProperty('currency_symbol', 'Rp');
    });

    it('should update existing settings and add new ones', async () => {
        const updateData = {
            app_name: 'Aliran Dana Pro',
            maintenance_mode: true,
            test_key_new: 'New Value',
            test_key_number: 123
        };

        const res = await request(app)
            .put('/api/app_settings')
            .set('Authorization', `Bearer ${authToken}`)
            .send(updateData);

        expect(res.statusCode).toEqual(200);
        const returnedData = res.body.response.data;
        
        expect(returnedData.app_name).toBe('Aliran Dana Pro');
        expect(returnedData.maintenance_mode).toBe(true);

        // Verify Persistence
        const getRes = await request(app).get('/api/app_settings');
        const settings = getRes.body.response.data;
        
        expect(settings.app_name).toBe('Aliran Dana Pro');
        expect(settings.maintenance_mode).toBe(true);
        expect(settings.test_key_new).toBe('New Value');
        expect(settings.test_key_number).toBe(123);
    });
});
