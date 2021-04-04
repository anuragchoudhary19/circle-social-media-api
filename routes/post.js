const express = require('express');
const router = express.Router();

const { create, listPosts } = require('../controllers/post');
const { validate } = require('../validator/post');

router.get('/', listPosts);
router.post('/post', validate, create);

module.exports = router;
