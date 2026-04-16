const allowedTaskStatus = ['pending', 'in-progress', 'completed'];

function sanitizeString(value) {
    if (typeof value !== 'string') {
        return '';
    }
    return value.trim();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRegister(req, res, next) {
    const name = sanitizeString(req.body?.name);
    const email = sanitizeString(req.body?.email).toLowerCase();
    const password = sanitizeString(req.body?.password);

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    req.body.name = name;
    req.body.email = email;
    req.body.password = password;
    return next();
}

function validateLogin(req, res, next) {
    const email = sanitizeString(req.body?.email).toLowerCase();
    const password = sanitizeString(req.body?.password);

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    req.body.email = email;
    req.body.password = password;
    return next();
}

function validateTaskCreate(req, res, next) {
    const title = sanitizeString(req.body?.title);
    const description = sanitizeString(req.body?.description);

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }

    req.body.title = title;
    req.body.description = description;
    return next();
}

function validateTaskUpdate(req, res, next) {
    const hasTitle = typeof req.body?.title === 'string';
    const hasDescription = typeof req.body?.description === 'string';
    const hasStatus = typeof req.body?.status === 'string';

    if (!hasTitle && !hasDescription && !hasStatus) {
        return res.status(400).json({ message: 'At least one field (title, description, status) is required' });
    }

    if (hasTitle) {
        req.body.title = sanitizeString(req.body.title);
        if (!req.body.title) {
            return res.status(400).json({ message: 'Title cannot be empty' });
        }
    }

    if (hasDescription) {
        req.body.description = sanitizeString(req.body.description);
        if (!req.body.description) {
            return res.status(400).json({ message: 'Description cannot be empty' });
        }
    }

    if (hasStatus) {
        req.body.status = sanitizeString(req.body.status);
        if (!allowedTaskStatus.includes(req.body.status)) {
            return res.status(400).json({ message: 'Invalid task status' });
        }
    }

    return next();
}

module.exports = {
    validateRegister,
    validateLogin,
    validateTaskCreate,
    validateTaskUpdate
};
