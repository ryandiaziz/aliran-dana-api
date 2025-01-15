import express from 'express';
import UserController from '../controllers/userController.js';
import encryptPassMiddleWare from '../middlewares/encryptPassMiddleware.js';
import authJWTMiddleware, { validateRegistraion } from '../middlewares/authMiddleware.js';

const userRoute = express.Router();

userRoute.post('/login', UserController.login);
userRoute.get('/', authJWTMiddleware, UserController.index);
userRoute.get('/:id', authJWTMiddleware, UserController.getOneUser);
userRoute.put('/:id', authJWTMiddleware, UserController.updateUser);
userRoute.delete('/:id', authJWTMiddleware, UserController.deleteUser);
userRoute.post('/', validateRegistraion, encryptPassMiddleWare, UserController.createUser);

export default userRoute;