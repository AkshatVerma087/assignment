const express = require('express');
const router = express.Router();
const {register, login, logout} = require('../controllers/auth.controller');
const { authUserMiddleware } = require('../middlewares/auth.middleware');
const { validateRegister, validateLogin } = require('../middlewares/validate.middleware');



router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/logout', logout);

// to check if the user is authenticated, frontend calls it on reload
router.get('/verify', authUserMiddleware, (req, res) => {
	res.status(200).json({
		message: 'user is authenticated',
		user: req.user
	});
});

module.exports = router;