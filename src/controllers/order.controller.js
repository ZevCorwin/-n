// src/controllers/order.controller.js
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

exports.showCheckoutPage = async (req, res) => {
    const userId = req.user._id;

    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || !cart.items.length) {
            return res.redirect('/shoping-cart'); // Chuyển hướng về giỏ hàng nếu giỏ hàng trống
        }

        res.render('checkout', { cart });
    } catch (error) {
        console.error('Error in showCheckoutPage:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createOrder = async (req, res) => {
    const userId = req.user._id;
    const { address, city, phone, coupon, paymentMethod } = req.body;

    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || !cart.items.length) {
            return res.status(400).send('Your cart is empty');
        }

        const subtotal = cart.items.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);
        const discount = 0; // Thêm logic mã giảm giá tại đây nếu cần
        const total = subtotal - discount; // Có thể thêm phí vận chuyển hoặc các chi phí khác vào tổng cộng nếu cần

        const order = new Order({
            userId,
            items: cart.items,
            subtotal,
            total,
            shippingAddress: {
                address,
                city,
                phone
            },
            paymentMethod,
            coupon
        });

        await order.save();
        // Xoá giỏ hàng sau khi đặt hàng
        await Cart.deleteOne({ userId });

        res.status(200).send('Order placed successfully');
    } catch (error) {
        console.error('Error in createOrder:', error);
        res.status(500).send('Internal Server Error');
    }
};
