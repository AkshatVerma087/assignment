const { authUserMiddleware } = require('../middlewares/auth.middleware');
const {createTask, getTasks, updateTask, deleteTask} = require('../controllers/task.controller');
const { validateTaskCreate, validateTaskUpdate } = require('../middlewares/validate.middleware');
const express = require('express');
const router = express.Router();

// Create a new task
router.post('/', authUserMiddleware, validateTaskCreate, createTask);
router.get('/', authUserMiddleware, getTasks);
router.put('/:id', authUserMiddleware, validateTaskUpdate, updateTask);
router.delete('/:id', authUserMiddleware, deleteTask);

module.exports = router;