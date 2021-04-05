const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const expresValidator = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

//CONNECT TO DATABASE
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DATABASE CONNECTED'));

mongoose.connection.on('error', (err) => {
    console.log(`DATABASE CONNECTION ERROR:${err.message}`);
});
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');

//middlewares
app.use(morgan('dev'));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '2mb' }));
app.use(expresValidator());

//routes
app.use('/', postRoutes);
app.use('/', authRoutes);

//port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
