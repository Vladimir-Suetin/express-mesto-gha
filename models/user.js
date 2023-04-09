const mongoose = require('mongoose');
const validator = require('validator');
const linkRegex = require('../utils/linkRegex');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.ru',
    validate: {
      validator: (v) => linkRegex.test(v),
      message: 'ссылка некорректная',
    },
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
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
