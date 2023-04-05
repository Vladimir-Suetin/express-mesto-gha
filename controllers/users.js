const User = require('../models/user');
const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/serverStatus');

const NotFoundError = require('../errors/notFoundError');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send({ users }))
    .catch((err) => {
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      console.log({ message: err.message });
    });
};

const getUser = (req, res) => {
  const { id } = req.params;

  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.status(STATUS_OK).send({ user });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: 'введен некорректный id пользователя' });
      }
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      return console.log({ message: err.message });
    });
};

const createUser = (req, res) => {
  User.create({ ...req.body })

    .then((user) => {
      res.status(STATUS_CREATED).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).send({
          message: err.message,
        });
      }
      if (err.code === 11000) {
        return res.status(409).send({ message: 'Пользователь с такими данными уже существует' });
      }
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      return console.log({ message: err.message });
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
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь id: ${userId} не найден`);
      }
      res.status(STATUS_OK).send({ user });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(err.statusCode).send({
          message: err.message,
        });
      }
      if (err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).send({
          message: err.message,
        });
      }
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      return console.log({ message: err.message });
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
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь id: ${userId} не найден`);
      }
      res.status(STATUS_OK).send({ user });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(err.statusCode).send({
          message: err.message,
        });
      }
      if (err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).send({
          message: err.message,
        });
      }
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка на сервере' });
      return console.log({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
