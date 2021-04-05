const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config();

exports.signup = async (req, res) => {
    const userExist = await User.findOne({ email: req.body.email }).exec()
    if (userExist) {
        return res.status(403).json({ error: 'Email is taken' })
    }
    const user = await new User(req.body).save()
    res.status(200).json({ message: 'Signup successful. Please login!' })
}

exports.signin = async (req, res) => {
    //find the user based email
    const { email, password } = req.body
    const user = await User.findOne({ email }).exec()
    //if error or no user
    if (!user) {
        return res.status(401).json({ error: 'User with that email does not exist.Enter a valid email' })
    }
    //if user authenticate
    if (!user.authenticate(password)) {
        return res.status(401).json({ error: 'Email and password do not match' })
    }
    //generate token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    //persist the token as 'token' in cookie with expiry date
    res.cookie('token', token, { expire: new Date() + 86400 })
    //return response with user and token to frontend client
    const { _id, name } = user
    return res.json({ token, user: { _id, name, email } })

}

exports.signout = (req, res) => {
    res.clearCookie('token')
    return res.json({ message: 'Signout success!' })
}