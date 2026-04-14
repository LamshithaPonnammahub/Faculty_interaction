const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function seed() {
    try {
        console.log('Connecting to DB for seeding...');
        // Clean out data (init_db does schema, but we can truncate courses if running separately)
        await pool.query('TRUNCATE TABLE courses CASCADE');
        await pool.query('TRUNCATE TABLE course_categories CASCADE');
        await pool.query('TRUNCATE TABLE course_types CASCADE');
        await pool.query('TRUNCATE TABLE boards CASCADE');
        await pool.query('TRUNCATE TABLE classes CASCADE');
        await pool.query('TRUNCATE TABLE subjects CASCADE');

        console.log('DB clean. Populating relational tables...');

        // Insert categories
        await pool.query(`INSERT INTO course_categories (name) VALUES ('Academic'), ('Non-Academic')`);
        // Insert course types
        await pool.query(`INSERT INTO course_types (name) VALUES ('Individual'), ('Group')`);
        // Insert boards
        await pool.query(`INSERT INTO boards (name) VALUES ('CBSE'), ('ICSE')`);
        // Insert classes
        for(let i=5; i<=12; i++) {
            await pool.query(`INSERT INTO classes (name) VALUES ('Class ${i}')`);
        }
        // Insert subjects
        const subjects = ["English", "Hindi", "German", "French", "Social Science (SS)", "Physics", "Chemistry", "Biology", "Mathematics"];
        for(const sub of subjects) {
            await pool.query(`INSERT INTO subjects (name) VALUES ($1)`, [sub]);
        }

        // Fetch them to maps
        const getMap = async (table) => {
            const res = await pool.query(`SELECT id, name FROM ${table}`);
            const map = {};
            res.rows.forEach(r => map[r.name] = r.id);
            return map;
        }

        const catMap = await getMap('course_categories');
        const typeMap = await getMap('course_types');
        const boardMap = await getMap('boards');
        const classMap = await getMap('classes');
        const subMap = await getMap('subjects');

        let courses = [];
        const add = (title, category_id=null, course_type_id=null, board_id=null, class_id=null, subject_id=null) => {
            courses.push({ title, desc: "Learn more about " + title.split('|').pop(), ids: [category_id, course_type_id, board_id, class_id, subject_id] });
        };

        // 1. For Individuals
        const ielts = ["IELTS Grammar", "IELTS Express", "IELTS Advance", "IELTS Advance+", "IELTS Mock tests", "IELTS Paper corrections"];
        ielts.forEach(c => add(`For Individuals|English language|International English Assessment|IELTS|${c}`));
        
        const oet = ["OET English Grammar", "OET Express", "OET Advance", "OET Advance+", "OET Mock tests", "OET Paper corrections"];
        oet.forEach(c => add(`For Individuals|English language|International English Assessment|OET|${c}`));

        ["PTE", "CELPIP", "TOFEL"].forEach(c => add(`For Individuals|English language|International English Assessment|${c}`));

        const spoken = ["Spoken English", "Speech correction", "Accent neutralization", "Effective communication", "phonetics"];
        spoken.forEach(c => add(`For Individuals|English language|Spoken English|${c}`));

        const personality = ["Art of Communication Engineering", "Body language", "presentation Skills", "Emotional Intelligence in the Age of Artificial Intelligence", "writing for digital Era", "Dealing with difficult people", "Assertiveness and confidence", "Interview Skills"];
        personality.forEach(c => add(`For Individuals|Personality Development|${c}`));

        // 2. For Enterprise
        const enterprise = ["Act of Communication Engineering", "Body language", "presentation Skills", "Emotional Intelligence in the Age of Artificial Intelligence", "writing for digital Era", "Dealing with difficult people", "Assertiveness and confidence"];
        enterprise.forEach(c => add(`For Enterprise|${c}`));

        // 3. For School Students
        // Academic -> Individual Class -> Contact us
        add(`For School Students|Academic|Individual Class|Contact us`, catMap['Academic'], typeMap['Individual']);

        // Academic -> Group Sessions -> CBSE / ICSE -> Classes 5-12
        for(let i=5; i<=12; i++) {
            subjects.forEach(sub => {
                const clsName = `Class ${i}`;
                // Using exact category breadcrumb user gave for Navbar
                add(`For School Students|Academic|Group Sessions|CBSE|${clsName}|${sub}`, catMap['Academic'], typeMap['Group'], boardMap['CBSE'], classMap[clsName], subMap[sub]);
                add(`For School Students|Academic|Group Sessions|ICSE|${clsName}|${sub}`, catMap['Academic'], typeMap['Group'], boardMap['ICSE'], classMap[clsName], subMap[sub]);
            });
        }

        const nonAcademic = ["Assignments and Projects", "Public Speaking", "Grammar Correction", "Phonics", "Writing Skills", "Calligraphy", "Spelling Mechanism", "Counselling"];
        nonAcademic.forEach(c => add(`Non-Academic|${c}`, catMap['Non-Academic']));

        // 4. For colleges and universities
        add(`For colleges and universities|Engineering College|Language preparation`);
        add(`For colleges and universities|Engineering College|Interview skills`);
        add(`For colleges and universities|Medical Colleges|N-EXCEL (OET training)`);
        add(`For colleges and universities|Medical Colleges|language preparation`);
        add(`For colleges and universities|Medical Colleges|Interview skills`);

        // 5. Specific topic Sessions
        add(`Specific topic Sessions`);

        console.log(`Inserting ${courses.length} courses...`);
        for (const course of courses) {
           await pool.query(
               'INSERT INTO courses (title, description, faculty_id, category_id, course_type_id, board_id, class_id, subject_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
               [course.title, course.desc, 1, course.ids[0], course.ids[1], course.ids[2], course.ids[3], course.ids[4]]
           );
        }
        console.log('Successfully completed seeding rel tables and courses!');
    } catch(err) {
        console.error('Error seeding courses:', err.message);
    } finally {
        pool.end();
    }
}

seed();
