const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config');

const { STATUS } = require('../utils/serverStatus');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const UnauthorizedError = require('../errors/unauthorized');
const ConflictError = require('../errors/conflictError');

// GET /users (возвращает всех пользователей)
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(STATUS.OK).send({ users }))
    .catch(next);
};

// GET /users/:id (возвращает пользователя по id)
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
      if (err.name === 'CastError') {
        return next(new BadRequestError('введен некорректный id пользователя'));
      }
      return next(err);
    });
};

// GET /users/me (возвращает информацию о текущем пользователе)
// аутентификация происходит в auth, поделючается через роуты
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      next(new NotFoundError('Пользователь не найден'));
    })
    .then((user) => {
      res.status(STATUS.OK).send(user);
    })
    .catch((err) => next(err));
};

// POST /users/signup (создает пользователя по email и password)
const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      const { name, about, avatar, _id } = user;
      res.status(STATUS.CREATED).send({
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Данные не прошли валидацию'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с такими данными уже существует'));
      }
      return next(err);
    });
};

// POST /users/signin (авторизует пользователя по email и password)
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => {
      next(new UnauthorizedError('Пользователь не найден'));
    })
    .then((user) => {
      const result = bcrypt.compare(password, user.password).then((matched) => {
        if (matched) {
          return user;
        }
        throw new UnauthorizedError('Пользователь не найден');
      });
      return result;
    })
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ user, jwt });
    })
    .catch(next);
};

// PATCH /me (обновляет данные пользователя name и about)
const updateUser = (req, res, next) => {
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
      res.status(STATUS.OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Данные не прошли валидацию'));
      }
      return next(err);
    });
};

// PATCH users/me/avatar (обновляет аватар пользователя)
const updateAvatar = (req, res, next) => {
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
      res.status(STATUS.OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Данные не прошли валидацию'));
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
