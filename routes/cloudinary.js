const express = require('express');
const router = express.Router();
//middleware
const { jwtCheck, authCheck } = require('../middleware/auth');

//controllers
const { upload, remove } = require('../controllers/cloudinary');

//routes
router.post('/upload-image', jwtCheck, authCheck, upload);
router.post('/remove-image', jwtCheck, authCheck, remove);

module.exports = router;
