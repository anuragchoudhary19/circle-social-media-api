const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const ipAddressSchema = new mongoose.Schema(
  {
    ip: {
      type: Array,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('IP', ipAddressSchema);
