const express = require('express');
const router = express.Router();

const {
  allUsers,
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
  changePassword,
  toFollow,
  getSearchedUser,
} = require('../controllers/user');
const { jwtCheck, authCheck } = require('../middleware/auth');

router.get('/user', jwtCheck, authCheck, getUser);
router.put('/user', jwtCheck, authCheck, updateUser);
router.put('/user/changePassword', jwtCheck, authCheck, changePassword);
router.delete('/user', jwtCheck, authCheck, removeUser);

router.get('/users', jwtCheck, authCheck, allUsers);
router.get('/newUsers', jwtCheck, authCheck, toFollow);

router.get('/user/followers/:username', jwtCheck, authCheck, getFollowers);
router.get('/user/following/:username', jwtCheck, authCheck, getFollowing);
router.patch('/user/follow/:id', jwtCheck, authCheck, follow);
router.patch('/user/unfollow/:id', jwtCheck, authCheck, unfollow);

router.get('/user/:username', jwtCheck, authCheck, getProfile);
router.get('/users/:search', jwtCheck, authCheck, getSearchedUser);
//photo
router.get('/user/photo/:userId', jwtCheck, authCheck, userPhoto);
router.get('/user/background/:userId', jwtCheck, authCheck, userBackground);

module.exports = router;
