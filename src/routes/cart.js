// routes/cart.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/auth'); // Middleware kiểm tra người dùng đã đăng nhập

router.post('/add-to-cart', authMiddleware, cartController.addToCart);
router.post('/update-cart-quantity', cartController.updateCartQuantity);
router.post('/remove-from-cart', authMiddleware, cartController.removeFromCart); // Thêm endpoint remove
router.get('/shoping-cart', authMiddleware, cartController.viewCart);

module.exports = router;
