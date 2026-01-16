import express from 'express';
import UserController from '../controllers/user-controller.js';
import encryptPassMiddleWare from '../middlewares/encrypt-pass-middleware.js';
import authJWTMiddleware, { validateRegistraion } from '../middlewares/auth-middleware.js';
import validate from '../middlewares/validation-middleware.js';
import { createUserSchema } from '../validations/user-validation.js'

const userRoute = express.Router();

userRoute.post('/login', UserController.login);
userRoute.get('/', authJWTMiddleware, UserController.index);
userRoute.get('/:id', authJWTMiddleware, UserController.getOneUser);
userRoute.put('/:id', authJWTMiddleware, UserController.updateUser);
userRoute.delete('/:id', authJWTMiddleware, UserController.deleteUser);
userRoute.post('/', validateRegistraion, validate(createUserSchema), encryptPassMiddleWare, UserController.createUser);

export default userRoute;