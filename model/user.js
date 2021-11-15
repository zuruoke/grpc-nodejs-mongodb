const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {type: Object, default: null},
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
  });

const Userdb = mongoose.model('uzo', userSchema);

module.exports = Userdb;