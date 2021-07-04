const User = require('../models/user');
const expressJWT = require('express-jwt');
require('dotenv').config();

exports.jwtCheck = expressJWT({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'], // added later
  userProperty: 'auth',
  //if the token is valid ,express jwt appends the verified user's id
  //in an auth key to the request object
});

exports.authCheck = async (req, res, next) => {
  // console.log(req.auth);
  const { _id } = req.auth;
  try {
    const user = await User.findById(_id)
      .populate('following', '_id name username')
      .populate('followers', '_id name username')
      .lean()
      .exec();
    // console.log(user);
    req.profile = user;
    const authorized = req.profile && req.auth && req.profile._id.toString() === req.auth._id.toString();
    if (!authorized) {
      return res.status(403).json({ error: 'User is not authorized to perform this action' });
    }
    next();
  } catch (error) {
    return res.status(400).json({ error: 'User not found!' });
  }
};
