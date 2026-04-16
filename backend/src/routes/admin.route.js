const express = require('express');
const router = express.Router();
const { authAdminMiddleware } = require('../middlewares/auth.middleware');
const { getAllUsers } = require('../controllers/auth.controller');

router.get('/users', authAdminMiddleware, getAllUsers);

module.exports = router;