import express from 'express'
import UserController from '../controllers/userController.js'

const userRoute = express.Router()

userRoute.get('/', UserController.index);
// userRoute.get('/:id', UserController.getOneAccount);
// userRoute.post('/', UserController.createAccount);
// userRoute.put('/:id', UserController.updateAccount);
// userRoute.delete('/:id', UserController.deleteBarang);

export default userRoute