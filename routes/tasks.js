const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/users/login');
}

// GET: List all tasks (with optional search and status filter)
router.get('/', isAuthenticated, async (req, res) => {
  const query = { createdBy: req.user._id };

  if (req.query.status) {
    query.status = req.query.status;
  }
  if (req.query.search) {
    query.title = { $regex: req.query.search, $options: 'i' };
  }

  try {
    const tasks = await Task.find(query).lean();
    res.render('tasks/list', {
      tasks,
      user: req.user,
      search: req.query.search,
      status: req.query.status
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// GET: Show Add Task Form
router.get('/add', isAuthenticated, (req, res) => {
  res.render('tasks/add');
});

// POST: Create new task
router.post('/add', isAuthenticated, async (req, res) => {
  try {
    await Task.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    res.redirect('/tasks');
  }
});

// GET: Show Edit Task Form
router.get('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    }).lean();
    if (!task) {
      req.flash('error_msg', 'Task not found');
      return res.redirect('/tasks');
    }
    res.render('tasks/edit', { task });
  } catch (err) {
    console.error(err);
    res.redirect('/tasks');
  }
});

// PUT: Update Task
router.put('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body
    );
    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    res.redirect('/tasks');
  }
});

// DELETE: Delete Task
router.delete('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });
    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    res.redirect('/tasks');
  }
});

module.exports = router;

