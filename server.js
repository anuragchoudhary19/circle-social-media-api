const express = require('express');
const app = express();
// var server = require('http').createServer(app);
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

const corsOptions = {
  origin: ['https://circle-social-media.netlify.app/', 'https://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
  credentials: true,
};
//middlewares
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cors(corsOptions));
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

const io = require('socket.io')(9000, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
  allowUpgrades: true,
  credentials: true,
});

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
