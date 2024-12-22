import { verifyToken } from "../helpers/jwtHelper.js";
import Response from "../helpers/responseHelper.js";

const authJWTMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token)
        return res.status(401).json(Response.failed('Access Denied. No token provided.'));

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

export default authJWTMiddleware;