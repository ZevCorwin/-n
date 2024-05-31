const mongoose = require('mongoose');

class Mongo {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect('mongodb+srv://admin:admin@cluster0.phjfk2h.mongodb.net/shop-web-db')
            .then(() => {
                console.log('Database connection successfully');
            })
            .catch(err => {
                console.error('Database connection error');
            })
    }
}

module.exports = new Mongo();