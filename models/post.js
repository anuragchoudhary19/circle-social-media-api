const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const postSchema = new mongoose.Schema({
  post: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
  },
  likes: [{ type: ObjectId, ref: 'User' }],
  dislikes: [{ type: ObjectId, ref: 'User' }],
  comments: [
    {
      comment: { type: String, minlength: 1, maxlength: 200 },
      postedBy: { type: ObjectId, ref: 'User' },
    },
  ],
});

module.exports = mongoose.model('Post', postSchema);
