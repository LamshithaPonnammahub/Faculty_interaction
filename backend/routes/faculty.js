const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db');

// @route   GET /api/faculty/my-courses
// @desc    Get courses taught by faculty
// @access  Private/Faculty
router.get('/my-courses', auth(['faculty']), async (req, res) => {
    try {
        const courses = await pool.query('SELECT * FROM courses WHERE faculty_id = $1', [req.user.id]);
        res.json(courses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/faculty/lessons
// @desc    Add a new lesson to a course
// @access  Private/Faculty
router.post('/lessons', auth('faculty'), async (req, res) => {
    try {
        const { course_id, title, video_url, content } = req.body;
        
        // Verify faculty owns course
        const course = await pool.query('SELECT faculty_id FROM courses WHERE id = $1', [course_id]);
        if (course.rows.length === 0 || course.rows[0].faculty_id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized for this course' });
        }

        const newLesson = await pool.query(
            'INSERT INTO lessons (course_id, title, video_url, content) VALUES ($1, $2, $3, $4) RETURNING *',
            [course_id, title, video_url, content]
        );
        res.json(newLesson.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
