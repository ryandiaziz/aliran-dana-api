import express from 'express'
import AccountController from '../controllers/accountController.js'

const accountRoute = express.Router()

accountRoute.get('/', AccountController.index)
// userRoute.post('/', UserController.createUser)
// userRoute.post('/login', UserController.login)

export default accountRoute