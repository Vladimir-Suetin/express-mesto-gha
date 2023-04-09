const mongoose = require('mongoose');
const REGEXP_URL = require('../utils/linkRegex');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    requred: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    requred: true,
    validate: {
      validator: (v) => REGEXP_URL.test(v),
      message: 'ссылка некорректная',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    requred: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: 'user',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
