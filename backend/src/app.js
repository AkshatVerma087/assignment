const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const app = express();
const authRoute = require('./routes/auth.route');
const taskRoute = require('./routes/task.route');
const adminRoute = require('./routes/admin.route');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/error.middleware');

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
const apiV1Prefix = '/api/v1';

app.use(cors({
	origin: allowedOrigin,
	credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/health', (_req, res) => {
	res.status(200).json({
		status: 'ok',
		message: 'Server is healthy'
	});
});

app.use(`${apiV1Prefix}/auth`, authRoute);
app.use(`${apiV1Prefix}/tasks`, taskRoute);
app.use(`${apiV1Prefix}/admin`, adminRoute);

// Backward-compatible routes for existing local collections/clients.
app.use('/api/auth', authRoute);
app.use('/api/tasks', taskRoute);
app.use('/api/admin', adminRoute);

app.use(notFoundHandler);
app.use(globalErrorHandler);


module.exports = app;