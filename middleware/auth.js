const User = require('../models/user')
const expressJWT = require('express-jwt')
require('dotenv').config();

exports.requireSignin = expressJWT({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
    //if the token is valid ,express jwt appends the verified user's id
    //in an auth key to the request object
})
