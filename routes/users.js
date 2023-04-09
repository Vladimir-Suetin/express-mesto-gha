const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const REGEXP_URL = require('../utils/linkRegex');
const { getUsers, getUser, getCurrentUser, updateUser, updateAvatar } = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateUser,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(REGEXP_URL),
    }),
  }),
  updateAvatar,
);
router.get('/:id', getUser);

router.use(errors());

module.exports = router;
