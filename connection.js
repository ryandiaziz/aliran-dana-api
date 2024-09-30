import dotenv from 'dotenv'
dotenv.config()
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL + "?sslmode=require"
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
})

export default pool