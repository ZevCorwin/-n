// controllers/userController.js
const User = require('../models/user.model');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render('admin/userManagement', { users }); // Đảm bảo bạn có view 'userList.ejs'
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.addUser = async (req, res) => {
    try {
        const { username, email, password, isActive } = req.body;
        const newUser = new User({ username, email, password, isActive });
        await newUser.save();
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, isActive } = req.body;
        await User.findByIdAndUpdate(id, { username, email, isActive });
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        user.isActive = !user.isActive;
        await user.save();
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error toggling user status:', error);
        res.status(500).send('Internal Server Error');
    }
};
