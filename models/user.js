const mongoose = require('mongoose');
const validator = require('validator');
const REGEXP_URL = require('../utils/linkRegex');

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
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => REGEXP_URL.test(v),
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
