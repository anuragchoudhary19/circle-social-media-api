const User = require('../models/user');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.userById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id).exec();
    req.profile = user;
    next();
  } catch (error) {
    return res.status(400).json({ error: 'User not found!' });
  }
};

exports.hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
  if (!authorized) {
    return res.status(403).json({ error: 'User is not authorized to perform this action' });
  }
  next();
};

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $nin: [req.profile._id] } })
      .select('_id username firstname lastname photo')
      .exec();
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getUser = async (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  req.profile.__v = undefined;
  req.profile.email = undefined;
  const token = jwt.sign({ _id: req.profile._id }, process.env.JWT_SECRET);
  //persist the token as 'token' in cookie with expiry date
  res.cookie('token', token, { expireAt: new Date() + 86400 });
  return res.json({ ...req.profile, token });
};
exports.getProfile = async (req, res) => {
  try {
    const profile = await User.findOne({ username: req.params.username }).exec();
    if (profile) {
      profile.hashed_password = undefined;
      profile.salt = undefined;
      res.status(200).json({ profile });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate('followers').exec();
    const followers = user.followers;
    res.status(200).json({ followers });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};
exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate('following').exec();
    const following = user.following;
    res.status(200).json({ following });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // let user = await User.find({ _id: req.body.userData._id }).exec();
    console.log(req.body);
    // let userUpdated = _.extend(user, req.body.userData); //extends-mutates the source object that is user
    let user = await User.findOneAndUpdate({ _id: req.body.userData._id }, { ...req.body.userData }).exec();
    // user.hashed_password = undefined;
    // user.salt = undefined;
    res.json({ message: 'ok' });
  } catch (error) {
    console.log(err);
    return res.status(400).json({ error: 'You are not authorized to perform this action' });
  }
};
exports.userPhoto = async (req, res) => {
  if (req.profile.photo.data) {
    res.set(('Content-Type', req.profile.photo.contentType));
    return res.send(req.profile.photo.data);
  }
};
exports.userBackground = async (req, res) => {
  if (req.profile.photo.data) {
    res.set(('Content-Type', req.profile.background.contentType));
    return res.send(req.profile.background.data);
  }
};
exports.removeUser = async (req, res) => {
  let user = req.profile;
  user.remove((err, user) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
};

exports.follow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.profile._id, { $push: { following: req.params.id } }).exec();
    const followedUser = User.findByIdAndUpdate(req.params.id, { $push: { followers: req.profile._id } }).exec();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.profile._id, { $pull: { following: req.params.id } }).exec();
    const followedUser = User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.profile._id } }).exec();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

exports.newUsers = async (req, res) => {
  try {
    const newUsers = await User.find({ _id: { $nin: [req.profile._id] }, followers: { $nin: [req.profile._id] } })
      .select('_id username firstname lastname photo')
      .sort([['createdAt', -1]])
      .limit(5)
      .exec();
    console.log(newUsers);
    res.status(200).json({ newUsers });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
exports.getSearchedUser = async (req, res) => {
  try {
    const users = await User.find({ $text: { $search: req.params.search } })
      .select('_id username firstname lastname photo')
      .sort([['createdAt', -1]])
      .limit(5)
      .exec();
    console.log(users);
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
