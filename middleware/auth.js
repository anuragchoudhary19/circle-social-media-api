const User = require('../models/user');
const { expressjwt: jwt } = require('express-jwt');
require('dotenv').config();

exports.jwtCheck = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'], // added later
  userProperty: 'auth',
  //if the token is valid ,express jwt appends the verified user's id
  //in an auth key to the request object
});

exports.authCheck = async (req, res, next) => {
  const { _id } = req.auth;
  try {
    const user = await User.findOne({ _id }).lean().exec();
    req.profile = user;
    const authorized = req.profile._id.toString() === _id.toString();
    if (!authorized) {
      return res.status(403).json({ error: 'User is not authorized to perform this action' });
    }
    next();
  } catch (error) {
    return res.status(400).json({ error: 'User not found!' });
  }
};
