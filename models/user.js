const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requred: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    requred: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    requred: true,
  },
});

module.exports = mongoose.model('user', userSchema);
