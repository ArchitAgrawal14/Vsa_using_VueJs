import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
  host: process.env.DATABASE_HOST,       
  user: process.env.DATABASE_USER,       
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,  
  port: process.env.DATABASE_PORT || 3306, 
  ssl: process.env.DATABASE_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
});

export default db;