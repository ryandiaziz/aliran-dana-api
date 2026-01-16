import DbUtils from "../helpers/db-helper.js";
import Response from "../helpers/response-helper.js";
import AppSettingModel from "../models/app-setting-model.js";
import UserModel from "../models/user-model.js";
import { verifyToken } from "../helpers/jwt-helper.js";

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

export const validateRegistraion = async (req, res, next) => {
    try {
        await DbUtils.executeTransaction(async () => {
            const resAppSetting = await AppSettingModel.index();
            const resUserCount = await UserModel.countUser();

            const maxUsers = parseInt(resAppSetting[0].max_users);
            const isRegistrationOpen = resAppSetting[0].is_registration_open;
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