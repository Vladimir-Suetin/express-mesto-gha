const mongoose = require('mongoose');
const validator = require('validator');

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
  email: {
    type: String,
    require: true,
    unique: true,
    validate: [validator.isEmail, '{VALUE} не корректный'],
  },
  password: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('user', userSchema);
