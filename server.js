const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const requestIp = require('request-ip');
const fs = require('fs');

//CONNECT TO DATABASE
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DATABASE CONNECTED'))
  .catch((err) => console.log(`DATABASE CONNECTION ERROR:${err.message}`));
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized!' });
  }
});
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '2mb' }));
// app.use(expressValidator());
app.use(requestIp.mw());
let socket;
app.use(function (req, res, next) {
  req.socket = socket;
  next();
});

fs.readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)));

//port
const PORT = process.env.PORT || 8000;
let server = app.listen(PORT, (err) => {
  if (err) return console.log(err);
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
// socket io
const io = require('socket.io')(server, {
  cors: { origin: process.env.ORIGIN, methods: ['GET', 'PUT', 'POST', 'HEAD', 'PATCH', 'DELETE'] },
  transports: ['websocket', 'polling', 'flashsocket'],
  allowUpgrades: true,
});

io.on('connection', (s) => {
  s.on('end', function () {
    socket.disconnect();
  });
  socket = s;
});
