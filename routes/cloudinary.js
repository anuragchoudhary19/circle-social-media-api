const express = require('express');
const router = express.Router();
//middleware
const { jwtCheck, authCheck } = require('../middleware/auth');

//controllers
const { uploadImage, uploadVideo, remove } = require('../controllers/cloudinary');

//routes
router.post('/upload-image', jwtCheck, authCheck, uploadImage);
router.post('/upload-video', jwtCheck, authCheck, uploadVideo);
router.post('/remove-image', jwtCheck, authCheck, remove);

module.exports = router;
