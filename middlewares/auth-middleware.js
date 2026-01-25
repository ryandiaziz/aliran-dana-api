import DbUtils from "../helpers/db-helper.js";
import Response from "../helpers/response-helper.js";
import AppSettingModel from "../models/app-setting-model.js";
import UserModel from "../models/user-model.js";
import { verifyToken } from "../helpers/jwt-helper.js";
import CustomError from "../helpers/custom-error-helper.js";

const authJWTMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token)
        return res
            .status(401)
            .json(Response.failed('Access Denied. No token provided.'));

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res
            .status(403)
            .json(Response.failed(err.message || 'Invalid or expired token.'));
    }
}

export const validateRegistration = async (req, res, next) => {
    try {
        await DbUtils.executeTransaction(async () => {
            const settings = await AppSettingModel.getAllSettings();
            const resUserCount = await UserModel.countUser();

            // Check maintenance mode (KV Store returns object)
            if (settings.maintenance_mode === true) {
                throw new CustomError('Maintenance Mode', 503);
            }

            const maxUsers = parseInt(settings.max_users);
            const isRegistrationOpen = settings.is_registration_open;
            const totalUsers = parseInt(resUserCount[0].total_rows);

            if (!isRegistrationOpen) throw new Error("Registration not permitted");

            if (totalUsers >= maxUsers) throw new Error("The user has reached the maximum number");            
        });

        next();
    } catch (error) {
        return res
            .status(403)
            .json(Response.failed(error.message || 'Not allowed'));
    }
}

export default authJWTMiddleware;