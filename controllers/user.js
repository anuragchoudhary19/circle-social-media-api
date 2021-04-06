const User = require('../models/user')

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