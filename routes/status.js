const express = require('express');
const router = express.Router();

const {
  create,
  list,
  read,
  remove,
  like,
  retweet,
  comment,
  likesByThisUser,
  removeComment,
  readComments,
} = require('../controllers/status');
const { validateCreateStatus } = require('../validator/status');
const { jwtCheck, authCheck } = require('../middleware/auth');
const { userById } = require('../controllers/user');

router.post('/status', jwtCheck, authCheck, validateCreateStatus, create);
router.get('/status/:id', jwtCheck, authCheck, read);
router.get('/status/comments/:id', jwtCheck, authCheck, readComments);
router.get('/status/all/:id', jwtCheck, authCheck, list);
router.delete('/status/:id', jwtCheck, authCheck, remove);

router.put('/status/like/:id', jwtCheck, authCheck, like);
router.get('/status/likes/:id', jwtCheck, authCheck, likesByThisUser);
router.put('/status/retweet/:id', jwtCheck, authCheck, retweet);
router.post('/status/comment/:id', jwtCheck, authCheck, comment);
router.delete('/status/comment/:id', jwtCheck, authCheck, removeComment);

//any routes containing :userId,then app will first execute userById()
router.param('userId', userById);

module.exports = router;
