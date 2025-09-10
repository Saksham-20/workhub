const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Use DATABASE_URL for production (Render) or individual env vars for development
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      }
    : {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'workhub',
        password: process.env.DB_PASSWORD || 'root',
        port: process.env.DB_PORT || 5432,
      }
);

const runMigrations = async () => {
  const client = await pool.connect();
  try {
    const migrationFiles = [
      '001_create_users.sql',
      '002_create_jobs.sql',
      '003_create_proposals.sql'
    ];

    for (const file of migrationFiles) {
      const migration = fs.readFileSync(path.join(__dirname, '../migrations', file), 'utf8');
      await client.query(migration);
      console.log(`Migration ${file} executed successfully`);
    }
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    client.release();
  }
};

module.exports = { pool, runMigrations };