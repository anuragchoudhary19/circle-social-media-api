const Tweet = require('../models/tweet');
const _ = require('lodash');
const User = require('../models/user');

exports.tweetOnTimeline = async (req, res) => {
  try {
    const tweet = await new Tweet({ ...req.body, isOnTimeline: true, user: req.profile._id }).save();
    res.status(200).json({ message: 'ok' });
  } catch (error) {
    console.log(error);
    res.status(403).json({ error });
  }
};

exports.commentOnTweet = async (req, res) => {
  try {
    const comment = await new Tweet({ ...req.body.comment, isOnTweet: true, user: req.profile._id }).save();
    const tweet = await Tweet.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: comment._id } }).exec();
    res.status(200).json({ message: 'ok' });
  } catch (error) {
    res.status(401).json({ error: error });
    console.log(error);
  }
};

exports.listTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find({ user: req.params.userId })
      .where({ isOnTimeline: true })
      .populate('user', '_id firstname lastname username photo')
      .lean()
      .exec();
    tweets.forEach((tweet) => {
      if (JSON.stringify(tweet.likes).includes(req.profile._id)) {
        tweet.liked = true;
      } else {
        tweet.liked = false;
      }
      if (JSON.stringify(tweet.retweets).includes(req.profile._id)) {
        tweet.retweeted = true;
      } else {
        tweet.retweeted = false;
      }
    });
    res.status(200).json({ tweets });
  } catch (error) {
    res.status(403).json({ error: 'Not found' });
  }
};
exports.listLikedTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find({ $in: { likes: req.params.userId } })
      .populate('user', '_id firstname lastname username photo')
      .lean()
      .exec();
    tweets.forEach((tweet) => {
      if (JSON.stringify(tweet.likes).includes(req.profile._id)) {
        tweet.liked = true;
      } else {
        tweet.liked = false;
      }
      if (JSON.stringify(tweet.retweets).includes(req.profile._id)) {
        tweet.retweeted = true;
      } else {
        tweet.retweeted = false;
      }
    });
    res.status(200).json({ tweets });
  } catch (error) {
    res.status(403).json({ error: 'Not found' });
  }
};

exports.remove = async (req, res) => {
  try {
    const tweet = await Tweet.findOneAndDelete({ _id: req.params.id }).exec();
    const comments = await Tweet.deleteMany({ _id: { $in: [...tweet.comments] } }).exec();
    res.status(200).json({ message: 'ok' });
  } catch (error) {
    res.status(403).json({ error: error });
    console.log(error);
  }
};
exports.getTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findOne({ _id: req.params.id })
      .populate([
        { path: 'comments', populate: { path: 'user', select: '_id firstname lastname username photo' } },
        { path: 'user', select: '_id firstname lastname username photo' },
      ])
      .lean()
      .exec();
    console.log(tweet);
    if (tweet) {
      if (JSON.stringify(tweet.likes).includes(req.profile._id)) {
        tweet.liked = true;
      } else {
        tweet.liked = false;
      }
      if (JSON.stringify(tweet.retweets).includes(req.profile._id)) {
        tweet.retweeted = true;
      } else {
        tweet.retweeted = false;
      }
      tweet.comments.forEach((tweet) => {
        if (JSON.stringify(tweet.likes).includes(req.profile._id)) {
          tweet.liked = true;
        } else {
          tweet.liked = false;
        }
        if (JSON.stringify(tweet.retweets).includes(req.profile._id)) {
          tweet.retweeted = true;
        } else {
          tweet.retweeted = false;
        }
      });
    }
    res.status(200).json({ tweet });
  } catch (error) {
    res.status(403).json({ error: 'Not found' });
    console.log(error);
  }
};

exports.like = async (req, res) => {
  try {
    const tweet = await Tweet.findOne({ _id: req.params.id }).exec();
    if (tweet.likes.includes(req.profile._id)) {
      await Tweet.findOneAndUpdate({ _id: req.params.id }, { $pull: { likes: req.profile._id } }).exec();
    } else {
      await Tweet.findOneAndUpdate({ _id: req.params.id }, { $push: { likes: req.profile._id } }).exec();
    }
  } catch (error) {
    res.status(403).json({ error: 'Not found' });
  }
};
exports.retweet = async (req, res) => {
  const tweet = await Tweet.findOne({ _id: req.params.id }).exec();
  if (tweet.retweets.includes(req.profile._id)) {
    await Tweet.findOneAndUpdate({ _id: req.params.id }, { $pull: { retweets: req.profile._id } }).exec();
  } else {
    await Tweet.findOneAndUpdate({ _id: req.params.id }, { $push: { retweets: req.profile._id } }).exec();
  }
};

// exports.feed = async (req, res) => {
//   try {
//     const statuses = await Tweet.find({
//       $or: [
//         {
//           postedBy: { $in: [...req.profile.followers, ...req.profile.following, req.profile._id] },
//         },
//         {
//           likes: { $in: [...req.profile.followers, ...req.profile.following, req.profile._id] },
//         },
//       ],
//     })
//       .populate({
//         path: 'postedBy',
//         select: '_id firstname lastname username photo',
//       })
//       .lean()
//       .exec();
// const uniqStatuses = _.uniqBy(statuses, '_id');
// const comments = await Comment.find({
//   commentedBy: { $in: [...req.profile.followers, ...req.profile.following, req.profile._id] },
// })
//   .populate([
//     { path: 'statusId', populate: { path: 'postedBy', select: '_id firstname lastname username photo' } },
//     {
//       path: 'commentedBy',
//       select: '_id firstname lastname username photo',
//     },
//   ])
//   .lean()
//   .exec();
//     const feed = [...statuses];
//     const sortedFeed = feed.sort((a, b) => b.createdAt - a.createdAt);
//     res.status(200).json({ feed: sortedFeed });
//   } catch (error) {
//     res.status(401).json({ error: error });
//     console.log(error);
//   }
// };
