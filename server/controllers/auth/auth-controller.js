const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* MODEL IMPORT */
const User = require('../../models/User');
const { decryptData } = require('../../middlewares/decryption/decryptData');

/* REGISTER USER */
router.post('/register', async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(404).json({
            message: 'Username and Email and Password is required'
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'User with this email already exists'
            });
        }

        const existingUserName = await User.findOne({ username });
        if (existingUserName) {
            return res.status(409).json({
                message: 'User with this Username already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });
        res.status(201).json({
            message: 'User created Successfully',
            data: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            }
        })
    } catch (error) {
        next(error)
    }
});

/* LOGIN USER */
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(404).json({
            message: 'Username and Password is required'
        });
    }

    try {
        /* DECRYPT DATA BEFORE SAVING */
        const decryptedEmail = decryptData(email);
        const decryptedPassword = decryptData(password);
        
        const user = await User.findOne({ email: decryptedEmail });
        
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email'
            });
        }

        const isPasswordMatch = await bcrypt.compare(decryptedPassword, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: 'Invalid password'
            });
        }

        const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.status(200).json({
            message: `${user.username} Login successfull`,
            token: token,
            user: {
                id: user._id,
                email: user.email,
                token: token
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;