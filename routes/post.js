const express = require('express');
const router = express.Router();

const { create, listPosts } = require('../controllers/post');
const { validateCreatePost } = require('../validator/post');
const { requireSignin } = require('../middleware/auth');
const { userById } = require('../controllers/user');

router.get('/', requireSignin, listPosts);
router.post('/post', requireSignin, validateCreatePost, create);

//any routes containing :userId,then app will first execute userById()
router.param('userId', userById)

module.exports = router;
