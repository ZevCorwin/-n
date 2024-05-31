// src/routes/order.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const orderController = require('../controllers/order.controller');

router.get('/checkout', authMiddleware, orderController.showCheckoutPage);
router.post('/checkout', authMiddleware, orderController.createOrder);

module.exports = router;
