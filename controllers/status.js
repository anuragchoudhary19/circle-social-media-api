const Status = require('../models/status');
const Comment = require('../models/comment');
const User = require('../models/user');
const io = require('socket.io')(9001, {
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3002'],
  },
});
exports.create = (req, res) => {
  try {
    const status = new Status({ ...req.body, postedBy: req.profile._id }).save();
    res.status(200).json({ message: 'ok' });
  } catch (error) {
    console.log(error);
    res.status(403).json({ error });
  }
};

exports.list = async (req, res) => {
  try {
    const statuses = await Status.find({ postedBy: req.params.id })
      .sort([['createdAt', -1]])
      .exec();
    res.status(200).json({ statuses });
  } catch (error) {
    res.status(403).json({ error: 'Not found' });
    console.log(error);
  }
};
exports.read = async (req, res) => {
  try {
    const status = await Status.findOne({ _id: req.params.id })
      .populate({
        path: 'comments',
        populate: { path: 'commentedBy', select: '_id firstname lastname username photo' },
      })
      .sort([['createdAt', -1]])
      .populate('postedBy', '_id firstname lastname username photo')
      .exec();
    console.log(status);
    res.status(200).json({ status });
  } catch (error) {
    res.status(403).json({ error: 'Not found' });
    console.log(error);
  }
};
exports.remove = async (req, res) => {
  try {
    const status = await Status.findOneAndDelete({ _id: req.params.id }).exec();
    const comments = await Status.deleteMany({ _id: { $in: [...status.comments] } }).exec();
    console.log(status, comments);
    res.status(200).json({ message: 'ok' });
  } catch (error) {
    res.status(403).json({ error: error });
    console.log(error);
  }
};
exports.likesByThisUser = async (req, res) => {
  try {
    const status = await Status.find({ likes: { $in: req.params.id } })
      .lean()
      .exec();
    res.status(200).json({ status });
  } catch (error) {
    res.status(403).json({ error: 'Not found' });
    console.log(error);
  }
};

exports.like = async (req, res) => {
  const post = await Status.findOne({ _id: req.params.id, likes: { $in: [req.profile._id] } }).exec();
  if (post) {
    post
      .updateOne({ $pull: { likes: req.profile._id } })
      .then(() => {
        res.status(200).json({ message: 'ok' });
      })
      .catch((err) => {
        res.status(403).json({ error: 'Not found' });
        console.log(err);
      });
  } else {
    await Status.findOneAndUpdate({ _id: req.params.id }, { $push: { likes: req.profile._id } })
      .then(() => {
        res.status(200).json({ message: 'ok' });
      })
      .catch((err) => {
        res.status(403).json({ error: 'Not found' });
        console.log(err);
      });
  }
};
exports.retweet = async (req, res) => {
  const retweet = await Status.findOne({ _id: req.params.id, retweets: { $in: [req.profile._id] } }).exec();
  if (retweet) {
    retweet
      .updateOne({ $pull: { retweets: req.profile._id } })
      .then(() => {
        res.status(200).json({ message: 'ok' });
      })
      .catch((err) => {
        res.status(403).json({ error: 'Not found' });
        console.log(err);
      });
  } else {
    await Status.findOneAndUpdate({ _id: req.params.id }, { $push: { retweets: req.profile._id } })
      .then(() => {
        res.status(200).json({ message: 'ok' });
      })
      .catch((err) => {
        res.status(403).json({ error: 'Not found' });
        console.log(err);
      });
  }
};
exports.comment = async (req, res) => {
  console.log(req.body);
  try {
    const comment = await new Comment({ ...req.body.comment, commentedBy: req.profile._id }).save();
    console.log(comment);
    const status = await Status.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: comment._id } }).exec();
    res.status(200).json({ message: 'ok' });
  } catch (error) {
    res.status(401).json({ error: error });
    console.log(error);
  }
};
exports.removeComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({ _id: req.params.id }).exec();
    const statusUpdate = await Status.findOneAndUpdate(
      { _id: comment.statusId },
      { $pull: { comments: comment._id } }
    ).exec();
    res.status(200).json({ message: 'ok' });
  } catch (error) {
    res.status(401).json({ error: error });
    console.log(error);
  }
};
