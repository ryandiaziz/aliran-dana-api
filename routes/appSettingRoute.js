import express from 'express';
import AppSettingController from '../controllers/appSettingController.js';

const appSettingRoute = express.Router();

appSettingRoute.get('/', AppSettingController.index);

export default appSettingRoute;