const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const { v1: uuidv1 } = require('uuid')
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
        },
        hashed_password: {
            type: String,
            required: true
        },
        salt: String,
        image: {
            type: String
        },
    },
    { timestamps: true }
);

//virtual fields
userSchema
    .virtual('password')
    .set(function (password) {
        //create temporary variable called _password
        this._password = password;
        //generate a timestamp
        this.salt = uuidv1();
        //encryptPassword()
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

//methods
userSchema.methods = {
    authenticate: function (password) {
        return this.encryptPassword(password) === this.hashed_password
    },
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        } catch (error) {
            return '';
        }
    }
};

module.exports = mongoose.model('User', userSchema);
