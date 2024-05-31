const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/admin.model'); // Đảm bảo đường dẫn tới model admin đúng

// Kết nối tới cơ sở dữ liệu MongoDB Atlas của bạn
mongoose.connect('mongodb+srv://admin:admin@cluster0.phjfk2h.mongodb.net/shop-web-db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connection successfully');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB');

    try {
        // Kiểm tra xem có tài khoản admin nào không
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (!existingAdmin) {
            console.log('No existing admin user found. Creating a new admin user...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const admin = new Admin({
                username: 'admin',
                password: hashedPassword,
                email: 'admin@example.com'
            });
            await admin.save();
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists:', existingAdmin);
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.connection.close();
    }
});
