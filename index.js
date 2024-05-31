const app = require('./src/app');

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Sever is running on ${PORT}`);
})