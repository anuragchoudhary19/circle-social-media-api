const express = require('express');
const router = express.Router();

const {
  allUsers,
  userById,
  getUser,
  updateUser,
  removeUser,
  userPhoto,
  userBackground,
  follow,
  unfollow,
  getProfile,
  getFollowing,
  getFollowers,
  removeImage,
  newUsers,
  getSearchedUser,
} = require('../controllers/user');
const { jwtCheck, authCheck } = require('../middleware/auth');

router.patch('/user/follow/:id', jwtCheck, authCheck, follow);
router.patch('/user/unfollow/:id', jwtCheck, authCheck, unfollow);

router.get('/users', jwtCheck, authCheck, allUsers);
router.get('/user', jwtCheck, authCheck, getUser);
router.put('/user', jwtCheck, authCheck, updateUser);
router.delete('/user', jwtCheck, authCheck, removeUser);

router.get('/user/:username', jwtCheck, authCheck, getProfile);
router.get('/user/followers/:username', jwtCheck, authCheck, getFollowers);
router.get('/user/following/:username', jwtCheck, authCheck, getFollowing);
router.get('/newUsers', jwtCheck, authCheck, newUsers);
router.get('/users/:search', jwtCheck, authCheck, getSearchedUser);
router.get('/user/:username', jwtCheck, authCheck, getProfile);
//photo
router.get('/user/photo/:userId', jwtCheck, authCheck, userPhoto);
router.get('/user/background/:userId', jwtCheck, authCheck, userBackground);

//any routes containing :userId,then app will first execute userById()
// router.param('userId', userById);

module.exports = router;
