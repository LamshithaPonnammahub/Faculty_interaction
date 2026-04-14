const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../db');

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', auth('admin'), async (req, res) => {
    try {
        const users = await pool.query('SELECT id, name, email, role, created_at FROM users');
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/courses
// @desc    Get all courses
// @access  Private/Admin
router.get('/courses', auth('admin'), async (req, res) => {
    try {
        const courses = await pool.query(`
            SELECT c.*, u.name as faculty_name 
            FROM courses c
            LEFT JOIN users u ON c.faculty_id = u.id
        `);
        res.json(courses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Classes endpoints
router.get('/classes', auth('admin'), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM classes ORDER BY id');
        res.json(result.rows);
    } catch (err) { res.status(500).send('Server Error'); }
});
router.post('/classes', auth('admin'), async (req, res) => {
    try {
        const { name } = req.body;
        const result = await pool.query('INSERT INTO classes (name) VALUES ($1) RETURNING *', [name]);
        res.json(result.rows[0]);
    } catch (err) { res.status(500).send('Server Error'); }
});
router.delete('/classes/:id', auth('admin'), async (req, res) => {
    try {
        await pool.query('DELETE FROM classes WHERE id = $1', [req.params.id]);
        res.json({ msg: 'Class deleted' });
    } catch (err) { res.status(500).send('Server Error'); }
});

// Subjects endpoints
router.get('/subjects', auth('admin'), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM subjects ORDER BY id');
        res.json(result.rows);
    } catch (err) { res.status(500).send('Server Error'); }
});
router.post('/subjects', auth('admin'), async (req, res) => {
    try {
        const { name } = req.body;
        const result = await pool.query('INSERT INTO subjects (name) VALUES ($1) RETURNING *', [name]);
        res.json(result.rows[0]);
    } catch (err) { res.status(500).send('Server Error'); }
});
router.delete('/subjects/:id', auth('admin'), async (req, res) => {
    try {
        await pool.query('DELETE FROM subjects WHERE id = $1', [req.params.id]);
        res.json({ msg: 'Subject deleted' });
    } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;
