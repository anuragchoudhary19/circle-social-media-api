const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
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

//middlewares
app.use(morgan('dev'));

//routes
app.use('/', postRoutes);

//port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
