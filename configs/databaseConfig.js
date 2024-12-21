import pkg from 'pg';
import { config } from './dotenvConfig.js';

const { Pool } = pkg;

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL + "?sslmode=require"
    host: config.pgHost,
    user: config.pgUser,
    password: config.pgPassword,
    database: config.pgDatabase,
})

export default pool