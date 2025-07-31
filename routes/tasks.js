const express = require('express');
const router = express.Router();
const Task = require('../models/task');

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/users/login');
}

router.get('/', isAuthenticated, async (req, res) => {
    const query = req.query.search ? { title: new RegExp(req.query.search, 'i') } : {};
    const tasks = await Task.find(query).lean();
    res.render('tasks/list', { tasks, user: req.user });
});

router.get('/add', isAuthenticated, (req, res) => res.render('tasks/add'));
router.post('/add', isAuthenticated, async (req, res) => {
    await Task.create({ ...req.body, createdBy: req.user._id });
    res.redirect('/tasks');
});

router.get('/edit/:id', isAuthenticated, async (req, res) => {
    const task = await Task.findById(req.params.id).lean();
    res.render('tasks/edit', { task });
});
router.put('/edit/:id', isAuthenticated, async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/tasks');
});

router.delete('/delete/:id', isAuthenticated, async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/tasks');
});

module.exports = router;
