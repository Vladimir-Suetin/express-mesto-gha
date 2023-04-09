const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const REGEXP_URL = require('../utils/linkRegex');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/notFoundError');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', auth, cardRoutes);
router.post(
  '/users/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
      about: Joi.string().default('Исследователь').min(2).max(30),
      avatar: Joi.string()
        .regex(REGEXP_URL)
        .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    }),
  }),
  createUser,
);

router.post(
  '/users/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.use(errors());

router.use('*', (req, res, next) => {
  next(new NotFoundError(`страницы ${req.baseUrl} не существует`));
});

module.exports = router;
