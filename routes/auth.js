const express = require('express');
const router = express.Router();

const { signup, signin, signout } = require('../controllers/auth');
const { validateSignup } = require('../validator/user');

router.post('/signup', validateSignup, signup);
router.post('/signin', signin);
router.get('/logout', signout);

//any routes containing :userId,then app will first execute userById()

module.exports = router;
