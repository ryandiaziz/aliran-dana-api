import express from 'express'
import AccountController from '../controllers/accountController.js'

const accountRoute = express.Router()

accountRoute.get('/', AccountController.index);
accountRoute.get('/:id', AccountController.getOneAccount);
accountRoute.post('/', AccountController.createAccount);
accountRoute.put('/:id', AccountController.updateAccount);
accountRoute.delete('/:id', AccountController.deleteAccount);

export default accountRoute