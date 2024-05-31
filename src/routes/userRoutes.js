// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route cho trang quản lý người dùng
router.get('/', userController.getAllUsers);

// Route để thêm người dùng mới
router.post('/add', userController.addUser);

// Route để cập nhật người dùng
router.post('/update/:id', userController.updateUser);

// Route để xóa người dùng
router.post('/delete/:id', userController.deleteUser);

// Route để khóa/mở khóa người dùng
router.post('/toggle/:id', userController.toggleUserStatus);

module.exports = router;
