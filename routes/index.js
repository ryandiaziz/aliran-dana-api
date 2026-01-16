import express from 'express';
import accountRoutes from './account-route.js';
import userRoutes from './user-route.js';
import categoryRoutes from './category-route.js';
import transactionRoutes from './transaction-route.js';
import appSettingRoute from './app-setting-route.js';

const route = express.Router();

route.get('/', (req, res) => {
    res.json({
        info: 'Welcome'
    });
});

route.use('/accounts', accountRoutes);
route.use('/users', userRoutes);
route.use('/categories', categoryRoutes);
route.use('/transactions', transactionRoutes);
route.use('/app_settings', appSettingRoute);


export default route