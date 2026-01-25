import express from 'express';
import AppSettingController from '../controllers/app-setting-controller.js';
import authJWTMiddleware from '../middlewares/auth-middleware.js';

const appSettingRoute = express.Router();

appSettingRoute.get('/', AppSettingController.index);
appSettingRoute.put('/', authJWTMiddleware, AppSettingController.updateSettings);

export default appSettingRoute;