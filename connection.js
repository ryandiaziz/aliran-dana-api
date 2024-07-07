import dotenv from 'dotenv'
dotenv.config()
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    // connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    host: 'localhost',
    user: 'ryan',
    port: 5432,
    password: 'heritage',
    database: 'aliran_dana'
})

export default pool