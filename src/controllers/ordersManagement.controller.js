const Order = require('../models/order.model');

exports.showOrdersPage = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId');
        res.render('admin/ordersManagement', { orders });
    } catch (error) {
        console.error('Error in showOrdersPage:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);

        // Kiểm tra quyền của người dùng (ví dụ: chỉ admin mới có thể hủy đơn)
        if (req.user.role !== 'admin') {
            return res.status(403).send('Permission denied');
        }

        // Cập nhật trạng thái của đơn hàng thành "cancelled"
        order.status = 'cancelled';
        await order.save();

        res.redirect('/admin/orders');
    } catch (error) {
        console.error('Error in cancelOrder:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.completeOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);

        // Cập nhật trạng thái của đơn hàng thành "completed"
        order.status = 'completed';
        await order.save();

        res.redirect('/admin/orders');
    } catch (error) {
        console.error('Error in completeOrder:', error);
        res.status(500).send('Internal Server Error');
    }
};
