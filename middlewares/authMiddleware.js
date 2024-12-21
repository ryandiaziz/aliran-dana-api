import { verifyToken } from "../helpers/jsonWebToken";

export const authJWTMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token)
        return res.status(401).json({ message: 'Access Denied. No token provided.' });

    try {
        const decoded = verifyToken(token);
        console.log('decode : ', decoded);
        
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
}