import express from 'express';
import TransferController from '../controllers/transfer-controller.js';
import authJWTMiddleware from '../middlewares/auth-middleware.js';
import validate from '../middlewares/validation-middleware.js';
import { createTransferSchema } from '../validations/transfer-validation.js';

const transferRoute = express.Router();

transferRoute.get('/', authJWTMiddleware, TransferController.index);
transferRoute.post('/', authJWTMiddleware, validate(createTransferSchema), TransferController.createTransfer);

export default transferRoute;
