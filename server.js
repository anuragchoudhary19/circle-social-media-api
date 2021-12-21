const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const fs = require('fs');

//CONNECT TO DATABASE
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DATABASE CONNECTED'))
  .catch((err) => console.log(`DATABASE CONNECTION ERROR:${err.message}`));
app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: 'GET,PUT,POST,HEAD,PATCH,DELETE',
  })
);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '2mb' }));
app.use(expressValidator());

//port
const PORT = process.env.PORT || 8000;
let server = app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`));
// socket io
const io = require('socket.io')(server, {
  cors: { origin: process.env.ORIGIN, methods: ['GET', 'PUT', 'POST', 'HEAD', 'PATCH', 'DELETE'] },
  transports: ['websocket', 'polling', 'flashsocket'],
  allowUpgrades: true,
});
const socket = io.on('connection', (socket) => {
  socket.on('end', function () {
    socket.disconnect();
  });
  return socket;
});

app.use(function (req, res, next) {
  req.socket = socket;
  next();
});
//routes
fs.readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)));
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized!' });
  }
});
