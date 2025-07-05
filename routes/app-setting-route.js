import express from 'express';
import AppSettingController from '../controllers/app-setting-controller.js';

const appSettingRoute = express.Router();

appSettingRoute.get('/', AppSettingController.index);

export default appSettingRoute;