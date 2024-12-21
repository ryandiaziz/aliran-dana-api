import express from 'express';
import accountRoutes from './accountRoute.js';
import userRoutes from './userRoute.js';
import categoryRoutes from './categoryRoute.js';
import transactionRoutes from './transactionRoute.js';

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


export default route