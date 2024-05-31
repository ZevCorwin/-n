const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.showRegisterForm = (req, res) => {
    res.render('register', { user: req.user });
};

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).send('Username or email already exists');
        }
        
        // Tạo người dùng mới
        const user = new User({ username, email, password });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.showLoginForm = (req, res) => {
    res.render('login', { user: req.user });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && await user.comparePassword(password)) {
            const token = jwt.sign({ userId: user._id }, 'secretkey');
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/');
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};
