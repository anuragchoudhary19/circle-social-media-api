const express = require('express');
const router = express.Router();

const {
  tweetOnTimeline,
  commentOnTweet,
  listTweets,
  retweet,
  like,
  getTweet,
  remove,
} = require('../controllers/tweet');
const { validateCreateStatus } = require('../validator/tweet');
const { jwtCheck, authCheck } = require('../middleware/auth');

// router.get('/tweet/feed', jwtCheck, authCheck, feed);

router.post('/tweet', jwtCheck, authCheck, validateCreateStatus, tweetOnTimeline);
router.get('/tweets/:userId', jwtCheck, authCheck, listTweets);
// router.get('/tweets/:userId', jwtCheck, authCheck, listLikedTweets);
router.get('/tweet/:id', jwtCheck, authCheck, getTweet);

router.delete('/tweet/:id', jwtCheck, authCheck, remove);
// router.get('/status/comments/:id', jwtCheck, authCheck, readComments);

router.put('/tweet/like/:id', jwtCheck, authCheck, like);
router.put('/tweet/retweet/:id', jwtCheck, authCheck, retweet);
router.post('/tweet/comment/:id', jwtCheck, authCheck, commentOnTweet);
// router.delete('/tweet/comment/:id', jwtCheck, authCheck, removeComment);

//any routes containing :userId,then app will first execute userById()

module.exports = router;
