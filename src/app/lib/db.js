// lib/db.js
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