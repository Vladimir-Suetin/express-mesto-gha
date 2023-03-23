const User = require('../models/user');
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/serverStatus');

const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const InternalServerError = require('../errors/internalServerError');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send({ users }))
    .catch((err) => {
      if (err.name === InternalServerError) {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: err.message });
      }
    });
};

const getUser = (req, res) => {
  const { id } = req.params;

  return User.findById(id)
    .then((user) => {
      res.status(STATUS_OK).send({ user });
    })
    .catch((err) => {
      if (err.name === NotFoundError) {
        res.status(STATUS_NOT_FOUND).send({
          message: 'такого пользователя не существует или переданы некорректные данные',
        });
      }
    });
};

const createUser = (req, res) => {
  User.create({ ...req.body })
    .then((user) => res.status(STATUS_CREATED).send({ user }))
    .catch((err) => {
      if (err.name === BadRequestError) {
        res.status(STATUS_BAD_REQUEST).send({
          message: 'Переданы некоррекные данные при создании пользователя',
        });
      }
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => res.status(STATUS_CREATED).send({ user }))
    .catch((err) => {
      if (err.name === BadRequestError) {
        res.status(STATUS_BAD_REQUEST).send({
          message: 'При изменении данных пользователя произошла ошибка',
        });
      }
    });
};

const updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением});
    },
  )
    .then((user) => res.status(STATUS_CREATED).send({ user }))
    .catch((err) => {
      if (err.name === BadRequestError) {
        res.status(STATUS_BAD_REQUEST).send({ message: 'При изменении аватара произошла ошибка' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
