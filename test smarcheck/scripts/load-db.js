import fs from 'fs';
import mysql from 'mysql2/promise';

async function main(){
  try{
    const sqlPath = new URL('../sql/create_checkerhp.sql', import.meta.url).pathname;
    const sql = fs.readFileSync(sqlPath, 'utf8');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('Running SQL script...');
    await connection.query(sql);
    console.log('SQL script executed successfully.');
    await connection.end();
  } catch (err){
    console.error('Failed to load SQL file:', err);
    process.exit(1);
  }
}

main();
