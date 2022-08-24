const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
require('dotenv').config();

exports.signup = async (req, res) => {
  try {
    const [username, email] = await Promise.all([
      User.findOne({ email: req.body.email }),
      User.findOne({ username: req.body.username }),
    ]);
    if (username) {
      return res.status(403).json({ message: 'Username already taken' });
    }
    if (email) {
      return res.status(403).json({ message: 'Email already exists' });
    }
    const user = await new User(req.body).save();
    res.status(200).json({ message: 'Signup successfull. Please login' });
  } catch (error) {
    res.status(400).json({ message: 'Bad request' });
  }
};

exports.signin = async (req, res) => {
  //find the user based email
  const { email, password } = req.body;
  const user = await User.findOne({ email }).exec();
  //if error or no user
  if (!user) {
    return res.status(401).json({ error: 'User does not exist' });
  }
  //if user authenticate
  if (!user.authenticate(password)) {
    return res.status(401).json({ error: 'Email and password do not match' });
  }
  //generate token with user id and secret
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  //persist the token as 'token' in cookie with expiry date
  res.cookie('token', token, { expireAt: new Date() + 86400 });
  //return response with user and token to frontend client
  const { _id, firstname, lastname, username, photo, background, followers, following, createdAt } = user;
  return res.json({
    user: { _id, firstname, lastname, username, photo, background, followers, following, token, createdAt },
  });
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'success!' });
};
