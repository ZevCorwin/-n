// src/controllers/cart.controller.js
const Cart = require('../models/cart.model'); // Đảm bảo rằng bạn đã định nghĩa model Cart

exports.addToCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;

    try {
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Giỏ hàng đã tồn tại
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (itemIndex > -1) {
                // Sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
                cart.items[itemIndex].quantity += 1;
            } else {
                // Thêm sản phẩm mới vào giỏ hàng
                cart.items.push({ productId, quantity: 1, checked: false }); // Thêm trường checked
            }
        } else {
            // Tạo giỏ hàng mới
            cart = new Cart({
                userId,
                items: [{ productId, quantity: 1, checked: false }] // Thêm trường checked
            });
        }

        await cart.save();
        res.redirect('/shoping-cart');
    } catch (error) {
        console.error('Error in addToCart:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.updateCartQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    try {
        let cart = await Cart.findOne({ userId });

        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

            if (itemIndex > -1) {
                if (quantity === 0) {
                    cart.items.splice(itemIndex, 1);
                } else {
                    cart.items[itemIndex].quantity = quantity;
                }
            }
            await cart.save();
            res.status(200).json({ success: true, message: 'Cart updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Cart not found' });
        }
    } catch (error) {
        console.error('Error in updateCartQuantity:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



exports.removeFromCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;

    try {
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Lọc ra sản phẩm cần xóa
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
            await cart.save();
            res.json({ success: true, message: 'Product removed from cart successfully', cart });
        } else {
            res.status(404).json({ success: false, message: 'Cart not found' });
        }
    } catch (error) {
        console.error('Error in removeFromCart:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


exports.viewCart = async (req, res) => {
    const userId = req.user._id;

    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        let subtotal = 0;
        if (cart && cart.items) {
            subtotal = cart.items.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);
        }
        const total = subtotal; // Có thể thêm phí vận chuyển hoặc các chi phí khác vào tổng cộng nếu cần
        res.render('shoping-cart', { cart, subtotal, total });
    } catch (error) {
        console.error('Error in viewCart:', error);
        res.status(500).send('Internal Server Error');
    }
};
