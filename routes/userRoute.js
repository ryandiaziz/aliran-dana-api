import express from 'express';
import UserController from '../controllers/userController.js';
import encryptPassMiddleWare from '../middlewares/encryptPassMiddleware.js';
import authJWTMiddleware from '../middlewares/authMiddleware.js';

const userRoute = express.Router();

userRoute.post('/login', UserController.login);
userRoute.get('/', authJWTMiddleware, UserController.index);
userRoute.post('/', encryptPassMiddleWare, UserController.createUser);
userRoute.get('/:id', authJWTMiddleware, UserController.getOneUser);
userRoute.put('/:id', authJWTMiddleware, UserController.updateUser);
userRoute.delete('/:id', authJWTMiddleware, UserController.deleteUser);

export default userRoute;