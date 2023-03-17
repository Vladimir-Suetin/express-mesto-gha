const mongoose = require('mongoose');

const cardShema = new mongoose.Shema({
  name: {
    type: String,
    requred: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    requred: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    requred: true,
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
