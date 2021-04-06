const express = require('express');
const router = express.Router();

const { allUsers, userById, getUser, updateUser, removeUser } = require('../controllers/user')
const { requireSignin } = require('../middleware/auth');


router.get('/users', allUsers)
router.get('/user/:userId', requireSignin, getUser)
router.put('/user/:userId', requireSignin, updateUser)
router.delete('/user/:userId', requireSignin, removeUser)

//any routes containing :userId,then app will first execute userById()
router.param('userId', userById)

module.exports = router;