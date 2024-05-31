const express = require('express');
const router = express.Router();
const path = require('path');
const ProductController = require('../controllers/product.controller');
const authController = require('../controllers/auth.controller'); // Thêm dòng này để sử dụng authController
const cartRoutes = require('./cart');
const orderRoutes = require('./order.routes');

router.use('/api/v1/product', require('./product'));
router.use('/', cartRoutes);
router.use('/', orderRoutes);

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const productsPerPage = 10;
        const { paginatedProducts, totalPages } = await ProductController.getPaginatedProducts(page, productsPerPage);

        res.render('index', {
            data: paginatedProducts,
            currentPage: page,
            totalPages: totalPages,
            query: '',
            user: req.user // Truyền biến user vào view
        });
    } catch (error) {
        console.error('Error in / route:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route tìm kiếm sản phẩm
router.get('/search', async (req, res) => {
    const query = req.query.query;
    try {
        let products = [];
        if (query && query.trim() !== '') {
            products = await ProductController.searchProducts(query);
        }
        res.render('index', { data: products, query, totalPages: 1, currentPage: 1, user: req.user });
    } catch (error) {
        console.error('Error in /search route:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route chi tiết sản phẩm
router.get('/detail/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const product = await ProductController.getProduct(id);
        res.render('detail', { product, user: req.user });
    } catch (error) {
        console.error('Error in /detail/:id route:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Thêm các route đăng ký, đăng nhập, đăng xuất
router.get('/register', authController.showRegisterForm);
router.post('/register', authController.register);

router.get('/login', authController.showLoginForm);
router.post('/login', authController.login);

router.get('/logout', authController.logout);

module.exports = router;
