import express from 'express';
import CategoryController from '../controllers/transactionController.js';
import authJWTMiddleware from '../middlewares/authMiddleware.js';

const transactionRoute = express.Router();

transactionRoute.get('/', authJWTMiddleware, CategoryController.index);
transactionRoute.post('/filter', authJWTMiddleware, CategoryController.filterTransaction);
transactionRoute.get('/:id', authJWTMiddleware, CategoryController.getOneTransaction);
transactionRoute.post('/', authJWTMiddleware, CategoryController.createTransaction);
transactionRoute.put('/:id', authJWTMiddleware, CategoryController.updateTransaction);
transactionRoute.delete('/:id', authJWTMiddleware, CategoryController.deleteTransaction);

export default transactionRoute;