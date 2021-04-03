const express = require('express');
const router = express.Router();

const postControllers = require('../controllers/post');

router.get('/', postControllers.getPost);

module.exports = router;
