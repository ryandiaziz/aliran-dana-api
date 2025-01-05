import express from 'express';
import AccountController from '../controllers/accountController.js';
import authJWTMiddleware from '../middlewares/authMiddleware.js';

const accountRoute = express.Router();

accountRoute.get('/', authJWTMiddleware, AccountController.index);
accountRoute.get('/:id', authJWTMiddleware, AccountController.getOneAccount);
accountRoute.post('/', authJWTMiddleware, AccountController.createAccount);
accountRoute.put('/', authJWTMiddleware, AccountController.updateAccount);
accountRoute.delete('/:id', authJWTMiddleware, AccountController.deleteAccount);

export default accountRoute;