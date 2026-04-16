const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

async function authUserMiddleware(req, res, next) {
    let token = req.cookies.token;

    // If no token in cookies, check Authorization header
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7); // Remove "Bearer " prefix
        }
    }

    if(!token) {
        return res.status(401).json({
            message: "Please login to access this resource"
        });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                message: 'User not found'
            });
        }

        req.user = user;

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}


async function authAdminMiddleware(req, res, next) {
    let token = req.cookies.token;


    if(!token){
        const authHeader = req.headers.authorization;
        if(authHeader && authHeader.startsWith('Bearer ')){
            token = authHeader.slice(7);
        }
    }
    if(!token) {
        return res.status(401).json({
            message: "Please login to access this resource"
        });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');

        if(!user || user.role !== 'admin'){
            return res.status(401).json({
                message: "You don't have permission to access this resource"
            });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}


module.exports = {authUserMiddleware, authAdminMiddleware}