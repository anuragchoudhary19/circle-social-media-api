const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const tweetSchema = new mongoose.Schema(
  {
    isTweet: Boolean,
    isReply: Boolean,
    repliedTo: { type: ObjectId, ref: 'Tweet' },
    tweet: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
    },
    video: {
      public_id: String,
      url: String,
    },
    retweets: [{ type: ObjectId, ref: 'User' }],
    likes: [{ type: ObjectId, ref: 'User' }],
    comments: [
      {
        type: ObjectId,
        ref: 'Tweet',
      },
    ],
    user: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tweet', tweetSchema);
