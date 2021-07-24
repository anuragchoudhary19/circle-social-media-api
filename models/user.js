const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const { v1: uuidv1 } = require('uuid');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      maxlength: 30,
      minlength: 2,
      text: true,
      index: true,
    },
    firstname: {
      type: String,
      trim: true,
      text: true,
      index: true,
    },
    lastname: {
      type: String,
      trim: true,
      text: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    photo: {
      public_id: { type: String },
      url: {
        type: String,
        default:
          'https://res.cloudinary.com/dtknvzouc/image/upload/v1626040666/blank-profile-picture-973460_1280_tploix.png',
      },
    },
    background: {
      public_id: { type: String },
      url: {
        type: String,
      },
    },
    bio: { type: String, maxlength: 200 },
    dob: { type: String },
    following: [{ type: ObjectId, ref: 'User' }],
    followers: [{ type: ObjectId, ref: 'User' }],
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
    return this.encryptPassword(password) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    } catch (error) {
      return '';
    }
  },
};

module.exports = mongoose.model('User', userSchema);
