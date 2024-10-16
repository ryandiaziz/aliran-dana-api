import express from 'express';
import CategoryController from '../controllers/transactionController.js';

const transactionRoute = express.Router();

transactionRoute.get('/', CategoryController.index);
transactionRoute.post('/filter', CategoryController.filterTransaction);
transactionRoute.get('/:id', CategoryController.getOneTransaction);
transactionRoute.post('/', CategoryController.createTransaction);
transactionRoute.put('/:id', CategoryController.updateTransaction);
transactionRoute.delete('/:id', CategoryController.deleteTransaction);

export default transactionRoute;