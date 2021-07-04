const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const commentSchema = new mongoose.Schema(
  {
    statusId: {
      type: ObjectId,
      ref: 'Status',
    },
    text: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
    },
    likes: [{ type: ObjectId, ref: 'User' }],
    video: {
      public_id: String,
      url: String,
    },
    commentedBy: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
