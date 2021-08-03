const User = require('../models/user');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
  let token = req.headers.authorization.split(' ')[1];
  let decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded._id === req.profile._id) return res.status.json({ error: 'Token expired' });
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  req.profile.updatedAt = undefined;
  req.profile.__v = undefined;
  req.profile.email = undefined;
  res.json({ ...req.profile, token });
};
exports.getProfile = async (req, res) => {
  try {
    const profile = await User.findOne({ username: req.params.username }).exec();
    if (profile) {
      profile.hashed_password = undefined;
      profile.salt = undefined;
      profile.updatedAt = undefined;
      profile.__v = undefined;
      profile.email = undefined;
      res.status(200).json({ profile });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('followers')
      .select('_id username ,firstname lastname photo')
      .lean();
    const followers = user.followers;
    res.status(200).json({ followers });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};
exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('following')
      .select('_id username ,firstname lastname photo')
      .lean();
    const following = user.following;
    res.status(200).json({ following });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    console.log(req.body);
    let user = await User.findOneAndUpdate({ _id: req.profile._id }, { ...req.body.userData }, { new: true }).exec();
    res.status(201).json({ message: 'ok', username: user.username });
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
  try {
    const user = await User.findOne({ _id: req.profile._id });
    const [removedFollowing, removedFollower] = await Promise.all([
      User.findByIdAndUpdate(req.profile._id, { $pull: { following: req.params.id } }),
      User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.profile._id } }),
    ]);
    user.remove((err, user) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    });
  } catch (error) {
    res.status(400).json({ error: 'User not found' });
  }
};

exports.follow = async (req, res) => {
  try {
    const [newFollowing, newFollower] = await Promise.all([
      User.findByIdAndUpdate(req.profile._id, { $push: { following: req.params.id } }),
      User.findByIdAndUpdate(req.params.id, { $push: { followers: req.profile._id } }),
    ]);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

exports.unfollow = async (req, res) => {
  try {
    const [removedFollowing, removedFollower] = await Promise.all([
      User.findByIdAndUpdate(req.profile._id, { $pull: { following: req.params.id } }),
      User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.profile._id } }),
    ]);
    if (removedFollowing && removedFollower) {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

exports.toFollow = async (req, res) => {
  try {
    const newUsers = await User.find({ _id: { $nin: [...req.profile.following, req.profile._id] } })
      .select('_id username firstname lastname photo')
      .sort([['createdAt', -1]])
      .limit(5)
      .lean()
      .exec();
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
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
