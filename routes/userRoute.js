import express from 'express'
import UserController from '../controllers/userController.js'
import { encryptPassMiddleWare } from '../middlewares/encryptPassMiddleware.js';

const userRoute = express.Router()

userRoute.get('/', UserController.index);
userRoute.post('/', encryptPassMiddleWare, UserController.createUser);
userRoute.get('/:id', UserController.getOneUser);
userRoute.put('/:id', UserController.updateUser);
userRoute.delete('/:id', UserController.deleteUser);

export default userRoute