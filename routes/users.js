const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const REGEXP_URL = require('../utils/linkRegex');
const { getUsers, getUser, getCurrentUser, updateUser, updateAvatar } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', auth, getUsers);
router.get('/me', auth, getCurrentUser);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  auth,
  updateUser
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(REGEXP_URL),
    }),
  }),
  auth,
  updateAvatar
);
router.get('/:id', getUser);

router.use(errors());

module.exports = router;
