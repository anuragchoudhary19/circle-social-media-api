const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const statusSchema = new mongoose.Schema(
  {
    text: {
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
        ref: 'Comment',
      },
    ],
    postedBy: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Status', statusSchema);
