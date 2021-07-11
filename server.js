const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const Status = require('./models/status');
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
  })
);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '2mb' }));
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
let server = app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`));

const io = require('socket.io')(server, {
  cors: { origins: [process.env.ORIGIN] },
  transports: ['websocket', 'polling', 'flashsocket'],
  allowUpgrades: true,
});

const statusEventEmitter = Status.watch(null, { fullDocument: 'updateLookup' });
statusEventEmitter.on('change', async (change) => {
  console.log(change);
  if (change.operationType === 'update') {
    let document = change.fullDocument;
    io.emit('status-update', {
      id: document._id,
      likes: document.likes,
      forwards: document.retweets,
      comments: document.comments,
    });
  }
});
// io.on('connection', (socket) => {
//   socket.on('update', (message) => {
//     io.emit('update', message);
//     console.log(message);
//   });
//   socket.on('new-post', (id) => {
//     io.to(id).emit('reload', id);
//     console.log(id);
//   });
//   socket.on('profile-update', (id) => {
//     io.to(id).emit('reload', id);
//     console.log(id);
//   });
// });
