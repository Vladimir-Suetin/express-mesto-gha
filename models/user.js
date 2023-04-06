const mongoose = require('mongoose');
const validator = require('validator');
const { linkRegex } = require('../utils/linkRegex');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requred: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    requred: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    requred: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return linkRegex.test(v);
      },
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
