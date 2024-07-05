import express from 'express';
import accountRoutes from './accountRoutes.js';
import userRoutes from './userRoutes.js';
import categoryRoutes from './categoryRoutes.js';

const route = express.Router();

route.get('/', (req, res) => {
    res.json({
        info: 'Welcome'
    })
})

route.use('/accounts', accountRoutes);
route.use('/users', userRoutes);
route.use('/categories', categoryRoutes);


export default route