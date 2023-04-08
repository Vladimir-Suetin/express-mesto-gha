const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config');

const { STATUS } = require('../utils/serverStatus');

const NotFoundError = require('../errors/notFoundError');
const Unauthorized = require('../errors/unauthorized');

// GET /users
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(STATUS.OK).send({ users }))
    .catch(next);
};

// GET /users/:id
const getUser = (req, res, next) => {
  const { id } = req.params;

  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.status(STATUS.OK).send({ user });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(STATUS.BAD_REQUEST).send({ message: 'введен некорректный id пользователя' });
      }
      return next(err);
    });
};

// GET /users/me
const getCurrentUser = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new Unauthorized({ message: 'Необходима авторизация' });
  }
  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    throw new Unauthorized({ message: 'Необходима авторизация' });
  }

  User.findById(payload._id)
    .orFail(() => res.status(STATUS.NOT_FOUND).send({ message: 'Пользователь не найден' }))
    .then((user) => res.send(user))
    .catch(next);
};

// POST /users/signup
const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      res.status(STATUS.CREATED).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS.BAD_REQUEST).send({
          message: err.message,
        });
      }
      if (err.code === 11000) {
        return res.status(STATUS.CONFLICT).send({ message: 'Пользователь с такими данными уже существует' });
      }
      return next(err);
    });
};

// POST /users/signin
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => res.status(STATUS.NOT_FOUND).send({ message: 'Пользователь не найден' }))
    .then((user) => {
      const result = bcrypt.compare(password, user.password).then((matched) => {
        if (matched) {
          return user;
        }
        throw new NotFoundError('Пользователь не найден');
      });
      return result;
    })
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ user, jwt });
    })
    .catch(next);
};

// PATCH /me
const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь id: ${userId} не найден`);
      }
      res.status(STATUS.OK).send({ user });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(err.statusCode).send({
          message: err.message,
        });
      }
      if (err.name === 'ValidationError') {
        return res.status(STATUS.BAD_REQUEST).send({
          message: err.message,
        });
      }
      return next(err);
    });
};

// PATCH users/me/avatar
const updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением});
    }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь id: ${userId} не найден`);
      }
      res.status(STATUS.OK).send({ user });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(err.statusCode).send({
          message: err.message,
        });
      }
      if (err.name === 'ValidationError') {
        return res.status(STATUS.BAD_REQUEST).send({
          message: err.message,
        });
      }
      return next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  login,
  createUser,
  updateUser,
  updateAvatar,
};
