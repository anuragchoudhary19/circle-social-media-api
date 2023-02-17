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
  feed,
  listLikedTweets,
  listRepliedTweets,
  listTweetsWithMedia,
  getTweetComments,
  getNewTweet,
} = require('../controllers/tweet');
const { validateCreateStatus } = require('../validator/tweet');
const { jwtCheck, authCheck } = require('../middleware/auth');

router.get('/feed', jwtCheck, authCheck, feed);

router.post('/tweet', jwtCheck, authCheck, validateCreateStatus, tweetOnTimeline);
router.get('/tweets/all/:userId', jwtCheck, authCheck, listTweets);
router.get('/tweets/likes/:userId', jwtCheck, authCheck, listLikedTweets);
router.get('/tweets/replies/:userId', jwtCheck, authCheck, listRepliedTweets);
router.get('/tweets/media/:userId', jwtCheck, authCheck, listTweetsWithMedia);
router.get('/tweet/:id', jwtCheck, authCheck, getTweet);
router.get('/tweet/comments/:id', jwtCheck, authCheck, getTweetComments);

router.delete('/tweet/:id', jwtCheck, authCheck, remove);
// router.get('/status/comments/:id', jwtCheck, authCheck, readComments);

router.put('/tweet/like/:id', jwtCheck, authCheck, like);
router.put('/tweet/retweet/:id', jwtCheck, authCheck, retweet);
router.put('/tweet/comment/:id', jwtCheck, authCheck, commentOnTweet);
// router.delete('/tweet/comment/:id', jwtCheck, authCheck, removeComment);

//any routes containing :userId,then app will first execute userById()

module.exports = router;
