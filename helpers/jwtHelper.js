import jwt from 'jsonwebtoken';
import { config } from '../configs/dotenvConfig.js';

const verifyToken = (token) => {
    return jwt.verify(token, config.jwtSecret);
};

const generateToken = (data) => {
    return jwt.sign(data, config.jwtSecret);
};

export {
    verifyToken,
    generateToken
}