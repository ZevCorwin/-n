const express = require('express');
const router = express.Router();
const Admin = require('../models/admin.model');
const ProductController = require('../controllers/product.controller');
const ordersManagementController = require('../controllers/ordersManagement.controller');
const userController = require('../controllers/userController');
const upload = require('../config/multerConfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Middleware kiểm tra xác thực
function isAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }
    res.redirect('/admin/login');
}

// Hiển thị trang đăng nhập
router.get('/login', (req, res) => {
    res.render('admin/login', { error: null });
});

// Xử lý yêu cầu đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (admin && await bcrypt.compare(password, admin.password)) {
            const token = jwt.sign({ adminId: admin._id }, 'secretkey', { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/admin/dashboard');
        } else {
            res.render('admin/login', { error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err);
        res.render('admin/login', { error: 'Something went wrong, please try again' });
    }
});

// Route chính cho trang quản trị (cần xác thực)
router.get('/', isAuthenticated, (req, res) => {
    res.render('admin/dashboard', { user: req.user });
});

// Trang dashboard (cần xác thực)
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('admin/dashboard', { user: req.user });
});

// Route để hiển thị trang quản lý đơn hàng (cần xác thực)
router.get('/ordersManagement', isAuthenticated, ordersManagementController.showOrdersPage);

// Route để hủy đơn hàng (cần xác thực)
router.post('/orders/cancel/:orderId', isAuthenticated, ordersManagementController.cancelOrder);

// Route để hoàn thành đơn hàng (cần xác thực)
router.post('/orders/complete/:orderId', isAuthenticated, ordersManagementController.completeOrder);

// Routes cho quản lý người dùng (cần xác thực)
router.get('/users', isAuthenticated, userController.getAllUsers);
router.post('/users/add', isAuthenticated, userController.addUser);
router.post('/users/update/:id', isAuthenticated, userController.updateUser);
router.post('/users/delete/:id', isAuthenticated, userController.deleteUser);
router.post('/users/toggle/:id', isAuthenticated, userController.toggleUserStatus);

// Route để hiển thị danh sách sản phẩm (cần xác thực)
router.get('/products', isAuthenticated, async (req, res) => {
    try {
        const products = await ProductController.getListProduct();
        res.render('admin/productList', { products, success: req.query.success, error: req.query.error });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route để hiển thị form thêm sản phẩm mới (cần xác thực)
router.get('/products/create', isAuthenticated, (req, res) => {
    res.render('admin/productForm', { product: null });
});

// Route để xử lý việc tạo sản phẩm mới với upload hình ảnh (cần xác thực)
router.post('/products/create', isAuthenticated, upload.single('thumbnail'), async (req, res) => {
    try {
        req.body.thumbnail = req.file ? `/uploads/${req.file.filename}` : '';
        const newProduct = await ProductController.createProduct(req, res);
        res.redirect('/admin/products?success=Product created successfully');
    } catch (error) {
        console.error('Error creating product:', error);
        res.redirect('/admin/products?error=Failed to create product');
    }
});

// Route để hiển thị form chỉnh sửa sản phẩm (cần xác thực)
router.get('/products/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const product = await ProductController.getProduct(req.params.id);
        res.render('admin/productForm', { product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.redirect('/admin/products?error=Failed to fetch product details');
    }
});

// Route để xử lý việc cập nhật sản phẩm (cần xác thực)
router.post('/products/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const updatedProduct = await ProductController.updateProduct(req, res);
        res.redirect('/admin/products?success=Product updated successfully');
    } catch (error) {
        console.error('Error updating product:', error);
        res.redirect('/admin/products?error=Failed to update product');
    }
});

// Route để xử lý việc xóa sản phẩm (cần xác thực)
router.post('/products/delete/:id', isAuthenticated, async (req, res) => {
    try {
        const deletedProduct = await ProductController.deleteProduct(req, res);
        res.redirect('/admin/products?success=Product deleted successfully');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.redirect('/admin/products?error=Failed to delete product');
    }
});

// Xử lý yêu cầu đăng xuất
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/login');
});

module.exports = router;
