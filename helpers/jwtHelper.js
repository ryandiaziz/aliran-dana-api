import jwt from 'jsonwebtoken';
import { config } from '../config/dotenvConfig.js';

const verifyToken = (token) => {
    return jwt.verify(token, config.jwtSecret);
};

const generateToken = (data) => {
    return jwt.sign(data, screetCode);
};

export {
    verifyToken,
    generateToken
}