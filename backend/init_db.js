const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function runSchema() {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
    console.log('Running schema.sql...');
    await pool.query(schemaSql);
    console.log('Schema applied successfully.');
    
    // Check if we have courses, if not insert some
    const courses = await pool.query('SELECT COUNT(*) FROM courses');
    if (parseInt(courses.rows[0].count) === 0) {
        console.log('Inserting default courses...');
        await pool.query(`
            INSERT INTO users (name, email, password_hash, role) VALUES ('Admin', 'admin@example.com', 'hash', 'admin');
            INSERT INTO courses (title, description, faculty_id) VALUES ('UI/UX Design', 'Learn UI/UX', 1);
            INSERT INTO courses (title, description, faculty_id) VALUES ('Graphic Design', 'Learn Graphic Design', 1);
            INSERT INTO courses (title, description, faculty_id) VALUES ('Web Development', 'Learn Web Dev', 1);
            INSERT INTO courses (title, description, faculty_id) VALUES ('Digital Marketing', 'Learn Marketing', 1);
        `);
        console.log('Default courses inserted.');
    }
  } catch (err) {
    console.error('Error executing schema:', err.message);
  } finally {
    pool.end();
  }
}

runSchema();
