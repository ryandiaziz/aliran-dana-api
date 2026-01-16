import pkg from 'pg';
import { config } from './dotenv-config.js';

const { Pool } = pkg;
const poolConfig = () => {
    switch (config.environtment) {
        case 'PRODUCTION':
            return {
                connectionString: process.env.POSTGRES_URL + "?sslmode=require"
            };
        case 'DEVELOPMENT':
            return {
                host: config.pgHost,
                user: config.pgUser,
                password: config.pgPassword,
                database: config.pgDatabase,
            };
        default:
            throw new Error(`Unknown environment: ${environment}`);
    }
}

const pool = new Pool(poolConfig());

export default pool