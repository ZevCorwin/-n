const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        checked: { type: Boolean, default: false } // Thêm trường checked
    }]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
