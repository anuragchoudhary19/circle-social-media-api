const User = require('../models/user')
const _ = require('lodash')
exports.userById = async (req, res, next, id) => {
    try {
        const user = await User.findById(id).exec()
        req.profile = user
        next()
    } catch (error) {
        return res.status(400).json({ error: 'User not found!' })
    }
}

exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id === req.auth._id
    if (!authorized) {
        return res.status(403).json({ error: 'User is not authorized to perform this action' })
    }
    next()
}

exports.allUsers = async (req, res) => {
    try {
        const allUsers = await User.find({}).select('_id name email').exec()
        res.status(200).json({ users: allUsers })
    } catch (error) {
        res.status(400).json({ erro })
    }
}

exports.getUser = async (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

exports.updateUser = async (req, res) => {
    let user = req.profile
    user = _.extend(user, req.body)//extends-mutates the source object that is user
    user.save((err) => {
        if (err) {
            return res.status(400).json({ error: 'You are not authorized to perform this action' })
        }
        user.hashed_password = undefined
        user.salt = undefined
        res.json({ user })
    })
}

exports.removeUser = async (req, res) => {
    let user = req.profile
    user.remove((err, user) => {
        if (err) {
            return res.status(400).json({ error: err })
        }
        res.status(200).json({ message: "User deleted successfully" })
    })
}
