const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db');

// @route   GET /api/student/my-courses
// @desc    Get enrolled courses for student
// @access  Private/Student
router.get('/my-courses', auth('student'), async (req, res) => {
    try {
        const courses = await pool.query(`
            SELECT c.*, e.status, e.enrolled_at 
            FROM courses c
            JOIN enrollments e ON c.id = e.course_id
            WHERE e.student_id = $1
        `, [req.user.id]);
        res.json(courses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/student/enroll
// @desc    Enroll in a course
// @access  Private/Student
router.post('/enroll', auth('student'), async (req, res) => {
    try {
        const { course_id, course_title } = req.body;
        
        let finalCourseId = course_id;

        // Auto-provision course if ID is lacking but Title is present
        if (!finalCourseId && course_title) {
            const lookup = await pool.query('SELECT id FROM courses WHERE title = $1', [course_title]);
            if (lookup.rows.length > 0) {
                finalCourseId = lookup.rows[0].id;
            } else {
                const insert = await pool.query('INSERT INTO courses (title) VALUES ($1) RETURNING id', [course_title]);
                finalCourseId = insert.rows[0].id;
            }
        }

        if (!finalCourseId) {
            return res.status(400).json({ message: 'Course ID or Title is required' });
        }
        
        // Prevent duplicate enrollment
        const existing = await pool.query('SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2', [req.user.id, finalCourseId]);
        if(existing.rows.length > 0) {
            return res.status(400).json({ message: 'Already enrolled' });
        }

        const enroll = await pool.query(
            'INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING *',
            [req.user.id, finalCourseId]
        );
        res.json(enroll.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
