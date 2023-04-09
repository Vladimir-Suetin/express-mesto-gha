const Card = require('../models/card');
const { STATUS } = require('../utils/serverStatus');

const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const BadRequestError = require('../errors/badRequestError');

// GET cards/ (возвращает все карточки)
const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(STATUS.OK).send({ cards }))
    .catch(next);
};

// POST cards/ (создает карточку)
const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(STATUS.CREATED).send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError({ message: 'Данные не прошли валидацию' }));
      }
      return next(err);
    });
};

// DELETE users/:cardId (удаляет карточку)
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(new NotFoundError(`Карточка id: ${cardId} не найдена`))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалять чужую карточку');
      }
      return Card.deleteOne(cardId);
    })
    .then((card) => res.status(STATUS.OK).send({ message: `Карточка '${card.name}' удалена` }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError({ message: 'введен некорректный id карточки' }));
      }
      return next(err);
    });
};

// PUT cards/:cardId/likes (устанавливает лайк карточке)
const likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .populate('likes')
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка id: ${cardId} не найдена`);
      }
      res.status(STATUS.OK).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError({ message: 'введен некорректный id карточки' }));
      }
      return next(err);
    });
};

// DELETE cards/:cardId/likes (удаляет лайк с карточки)
const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка id: ${cardId} не найдена`);
      }
      res.status(STATUS.OK).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError({ message: 'введен некорректный id карточки' }));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
