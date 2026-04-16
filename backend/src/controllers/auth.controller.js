const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

function getCookieOptions() {
    return {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    };
}

async function register(req, res){
    try {
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email and password are required'
            });
        }

        const isUserExist = await userModel.findOne({email : email});

        if(isUserExist){
            return res.status(400).json({
                message: "User already exists"
            })
        }


        const hashedPass = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPass
        })

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET);

        res.cookie('token', token, getCookieOptions());

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (err) {
        res.status(500).json({
            message: 'Failed to register user'
        });
    }
}


async function login(req, res){
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const user = await userModel.findOne({email: email});

        if(!user){
            return res.status(400).json({
                message: "Incorrect password or email"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if(!isPasswordCorrect){
            return res.status(400).json({
                message: "Incorrect password or email"
            });
        }

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET);


        res.cookie('token', token, getCookieOptions());

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        })
    } catch (err) {
        res.status(500).json({
            message: 'Failed to login user'
        });
    }
}


function logout(req, res){
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    });
    res.status(200).json({
        message: "User logged out successfully"
    })
}


function verifyUser(req, res){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: "Not authenticated"
        })
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({
            message: "user is authenticated",
            user: decode
        })
    }catch(err){
        return res.status(401).json({
            message: "The token is invalid"
        })
    }
}

async function getAllUsers(req, res){
    try {
        const users = await userModel.find().select('-password').sort({timestamp: -1});

        res.status(200).json({
            message: 'Users fetched successfully',
            users
        });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch users'
        });
    }
}

module.exports = {
    register,
    login,
    logout,
    verifyUser,
    getAllUsers
}