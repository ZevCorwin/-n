// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/user.model');
const Admin = require('./models/admin.model'); // Thêm model Admin
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/static', express.static(path.join(__dirname, '../public')));
app.use('/admin-static', express.static(path.join(__dirname, '../public-admin')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

require('./dbs/mongodb');

app.use(async (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secretkey');
            req.user = await User.findById(decoded.userId) || await Admin.findById(decoded.adminId).select('-password'); // Thêm xác thực cho admin
        } catch (err) {
            console.error(err);
        }
    }
    next();
});

app.use((req, res, next) => {
    const originalRender = res.render;
    res.render = function(view, options, callback) {
        if (!options) options = {};
        options.user = req.user;
        originalRender.call(res, view, options, (err, html) => {
            if (err) return callback ? callback(err) : next(err);
            let modifiedHtml = html;
            if (req.originalUrl.startsWith('/admin')) {
                modifiedHtml = html.replace(/href="css/g, 'href="/admin-static/css')
                                   .replace(/src="js/g, 'src="/admin-static/js')
                                   .replace(/href="images/g, 'href="/admin-static/images')
                                   .replace(/src="images/g, 'src="/admin-static/images')
                                   .replace(/href="fonts/g, 'href="/admin-static/fonts')
            } else {
                modifiedHtml = html.replace(/href="css/g, 'href="/static/css')
                                   .replace(/src="js/g, 'src="/static/js')
                                   .replace(/href="images/g, 'href="/static/images')
                                   .replace(/src="images/g, 'src="/static/images')
                                   .replace(/href="vendor/g, 'href="/static/vendor')
                                   .replace(/href="fonts/g, 'href="/static/fonts')
                                   .replace(/href="vendor/g, 'href="/static/vendor')
                                   .replace(/src="vendor/g, 'src="/static/vendor');
            }
            callback ? callback(null, modifiedHtml) : res.send(modifiedHtml);
        });
    };
    next();
});

const mainRoutes = require('./routes');
app.use('/', mainRoutes);

const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

module.exports = app;
