import express from 'express';
import TransactionController from '../controllers/transaction-controller.js';
import authJWTMiddleware from '../middlewares/auth-middleware.js';

const transactionRoute = express.Router();

transactionRoute.get('/', authJWTMiddleware, TransactionController.index);
transactionRoute.post('/filter', authJWTMiddleware, TransactionController.filterTransaction);
transactionRoute.get('/:id', authJWTMiddleware, TransactionController.getOneTransaction);
transactionRoute.post('/', authJWTMiddleware, TransactionController.createTransaction);
transactionRoute.put('/:id', authJWTMiddleware, TransactionController.updateTransaction);
transactionRoute.delete('/:id', authJWTMiddleware, TransactionController.deleteTransaction);

export default transactionRoute;