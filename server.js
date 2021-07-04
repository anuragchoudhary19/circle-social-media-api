const express = require('express');
const app = express();
var http = require('http').createServer(app);
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const Status = require('./models/status');
const fs = require('fs');
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
  .then(() => console.log('DATABASE CONNECTED'))
  .catch((err) => console.log(`DATABASE CONNECTION ERROR:${err.message}`));

//middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cors());
app.use(expressValidator());

//routes
fs.readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)));
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized!' });
  }
});
//port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`));

const statusEventEmitter = Status.watch();
statusEventEmitter.on('change', async (change) => {
  console.log(change);
  if (change.operationType === 'update' || change.operationType === 'delete') {
    const updatedStatus = await Status.findOne({ _id: change.documentKey._id }).exec();
    if (updatedStatus) {
      console.log(updatedStatus);
      io.emit('post-update', {
        id: updatedStatus._id,
        likes: updatedStatus.likes,
        forwards: updatedStatus.retweets,
        comments: updatedStatus.comments,
      });
    }
  }
});
io.on('connection', (socket) => {
  socket.on('update', (message) => {
    io.emit('update', message);
    console.log(message);
  });
  socket.on('new-post', (id) => {
    io.to(id).emit('reload', id);
    console.log(id);
  });
  socket.on('profile-update', (id) => {
    io.to(id).emit('reload', id);
    console.log(id);
  });
});

const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3002', 'https://historic-capitol-reef-67891.herokuapp.com/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
  transports: ['websocket', 'polling'],
  allowUpgrades: true,
});
