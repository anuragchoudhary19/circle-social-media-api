const Tweet = require('../models/tweet');
const _ = require('lodash');
const User = require('../models/user');

exports.tweetOnTimeline = async (req, res) => {
  try {
    const tweet = await new Tweet({ ...req.body, isTweet: true, user: req.profile._id }).save();
    res.status(200).json({ message: 'ok' });
  } catch (error) {
    console.log(error);
    res.status(403).json({ error });
  }
};

exports.commentOnTweet = async (req, res) => {
  try {
    const comment = await new Tweet({
      ...req.body.comment,
      isReply: true,
      repliedTo: req.params.id,
      user: req.profile._id,
    }).save();
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
      .where({ isTweet: true })
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
    const tweets = await Tweet.find({ likes: { $in: req.params.userId } })
      .populate('user', '_id firstname lastname username photo')
      .lean()
      .exec();
    console.log(tweets);
    tweets.forEach((tweet) => {
      tweet.liked = true;
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
exports.listRepliedTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find({ user: req.params.userId })
      .where({ isReply: true })
      .populate([
        { path: 'user', select: '_id firstname lastname username photo' },
        { path: 'repliedTo', populate: { path: 'user', select: '_id firstname lastname username photo' } },
      ])
      .lean()
      .exec();
    console.log(tweets);
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
      if (tweet.repliedTo) {
        if (JSON.stringify(tweet.repliedTo.likes).includes(req.profile._id)) {
          tweet.repliedTo.liked = true;
        } else {
          tweet.repliedTo.liked = false;
        }
        if (JSON.stringify(tweet.repliedTo.retweets).includes(req.profile._id)) {
          tweet.repliedTo.retweeted = true;
        } else {
          tweet.repliedTo.retweeted = false;
        }
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
      .populate([{ path: 'user', select: '_id firstname lastname username photo' }])
      .lean()
      .exec();
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
    }
    res.status(200).json({ tweet });
  } catch (error) {
    res.status(403).json({ error: 'Not found' });
    console.log(error);
  }
};
exports.getTweetComments = async (req, res) => {
  try {
    const tweet = await Tweet.findOne({ _id: req.params.id })
      .populate([{ path: 'comments', populate: { path: 'user', select: '_id firstname lastname username photo' } }])
      .lean()
      .exec();
    if (tweet) {
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
    res.status(200).json({ comments: tweet.comments });
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
    res.status(200).json({ message: 'ok' });
  } catch (error) {
    res.status(403).json({ error: 'failed' });
  }
};
exports.retweet = async (req, res) => {
  try {
    const tweet = await Tweet.findOne({ _id: req.params.id }).exec();
    if (tweet.retweets.includes(req.profile._id)) {
      await Tweet.findOneAndUpdate({ _id: req.params.id }, { $pull: { retweets: req.profile._id } }).exec();
    } else {
      await Tweet.findOneAndUpdate({ _id: req.params.id }, { $push: { retweets: req.profile._id } }).exec();
    }
    res.status(200).json({ message: 'ok' });
  } catch (error) {
    res.status(403).json({ error: 'failed' });
  }
};

exports.feed = async (req, res) => {
  try {
    const [tweets, likes, retweets] = await Promise.all([
      Tweet.find({
        user: { $in: [...req.profile.followers, ...req.profile.following, req.profile._id] },
      })
        .populate([
          {
            path: 'user',
            select: '_id firstname lastname username photo',
          },
          { path: 'repliedTo', populate: { path: 'user', select: '_id firstname lastname username photo' } },
        ])
        .lean()
        .exec(),
      Tweet.find({
        likes: { $in: [...req.profile.followers, ...req.profile.following, req.profile._id] },
      })
        .populate({
          path: 'user',
          select: '_id firstname lastname username photo',
        })
        .lean()
        .exec(),
      Tweet.find({
        retweets: { $in: [...req.profile.followers, ...req.profile.following, req.profile._id] },
      })
        .populate({
          path: 'user',
          select: '_id firstname lastname username photo',
        })
        .lean()
        .exec(),
    ]);

    let feed = [...tweets, ...likes, ...retweets];
    let uniqueFeed = _.uniqBy(feed, (e) => {
      return JSON.stringify(e._id);
    });
    uniqueFeed.forEach((tweet) => {
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
      if (tweet.repliedTo) {
        if (JSON.stringify(tweet.repliedTo.likes).includes(req.profile._id)) {
          tweet.repliedTo.liked = true;
        } else {
          tweet.repliedTo.liked = false;
        }
        if (JSON.stringify(tweet.repliedTo.retweets).includes(req.profile._id)) {
          tweet.repliedTo.retweeted = true;
        } else {
          tweet.repliedTo.retweeted = false;
        }
      }
    });
    const sortedFeed = uniqueFeed.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json({ feed: sortedFeed });
  } catch (error) {
    res.status(401).json({ error: error });
    console.log(error);
  }
};
