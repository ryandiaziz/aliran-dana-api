import dotenv from 'dotenv';

dotenv.config();

export const config = {
    // App
    port: process.env.PORT || 3000,
    saltRound: parseInt(process.env.SALT_ROUND),
    // JWT
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    // Database
    pgHost: process.env.POSTGRES_HOST,
    pgUser: process.env.POSTGRES_USER,
    pgPassword: process.env.POSTGRES_PASSWORD,
    pgDatabase: process.env.POSTGRES_DATABASE,
};