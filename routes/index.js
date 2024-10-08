import express from 'express';
import accountRoutes from './accountRoutes.js';
import userRoutes from './userRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import transactionRoutes from './transactionRoutes.js';

const route = express.Router();

route.get('/', (req, res) => {
    res.json({
        info: 'Welcome'
    })
})

route.use('/accounts', accountRoutes);
route.use('/users', userRoutes);
route.use('/categories', categoryRoutes);
route.use('/transactions', transactionRoutes);


export default route