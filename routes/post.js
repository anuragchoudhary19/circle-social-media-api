const express = require('express');
const router = express.Router();

const { create, listPosts } = require('../controllers/post');
const { validateCreatePost } = require('../validator/post');

router.get('/', listPosts);
router.post('/post', validateCreatePost, create);

module.exports = router;
