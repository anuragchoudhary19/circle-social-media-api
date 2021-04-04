const Post = require('../models/post');

exports.create = (req, res) => {
  const post = new Post(req.body).save((err, result) => {
    res.status(200).json({ post: result });
  });
  console.log(req.body);
};

exports.listPosts = (req, res) => {
  const posts = Post.find({})
    .then((posts) => {
      res.status(200).json({ posts: posts });
    })
    .catch((err) => console.log(err));
};
