import express from 'express'
import UserController from '../controllers/userController.js'

const userRoute = express.Router()

userRoute.get('/', UserController.index);
userRoute.get('/:id', UserController.getOneUser);
userRoute.post('/', UserController.createUser);
userRoute.put('/:id', UserController.updateUser);
userRoute.delete('/:id', UserController.deleteUser);

export default userRoute