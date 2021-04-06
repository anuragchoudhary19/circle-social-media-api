const Post = require('../models/post');

exports.create = (req, res) => {
    const post = new Post(req.body).save((err, result) => {
        res.status(200).json({ post: result });
    });
};

exports.listPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).exec();
        if (posts) {
            res.status(200).json({ posts: posts });
        }
    } catch (error) {
        res.status(403).json({ error: 'Not found' });
        console.log(error);
    }
};
