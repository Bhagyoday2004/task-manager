const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.get('/', (req, res) => {
    res.render('index', { title: 'Task Manager', user: req.user });
});

router.get('/public', async (req, res) => {
    const tasks = await Task.find().lean();
    res.render('tasks/list', { tasks, public: true });
});

module.exports = router;
