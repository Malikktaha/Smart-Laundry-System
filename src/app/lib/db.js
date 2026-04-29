// lib/db.js
//This lib file is connect over project to database.
//We are using mysql12 version & promise means this will grantee over project will connect to database.
import mysql from 'mysql2/promise';


const pool = mysql.createPool({
  host: 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
  user: 'YA5xgoQKZFwmuuo.root',
  password: '1Cndqmc2YGvBqkdw',
  database: 'test',
  port: 4000, // Default TiDB Serverless port
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

export default pool;
// export pool this Makes connection usable in other files.
// import pool from '@/lib/db';

// User places order
// ↓
// Backend API receives request
// ↓
// db.js connects database
// ↓
// Order saved