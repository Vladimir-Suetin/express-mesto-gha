const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const REGEXP_URL = require('../utils/linkRegex');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(REGEXP_URL).required(),
  }),
}), createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

router.use(errors());

module.exports = router;
