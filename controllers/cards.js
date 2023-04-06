const Card = require('../models/card');

const { STATUS_OK, STATUS_CREATED, STATUS_BAD_REQUEST, STATUS_NOT_FOUND } = require('../utils/serverStatus');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError')

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(STATUS_OK).send({ cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(STATUS_CREATED).send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).send({
          message: err.message,
        });
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(new NotFoundError(`Карточка id: ${cardId} не найдена`))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        // return res.status(STATUS_NOT_FOUND).send({ message: 'Нельзя удалять чужую карточку' });
        throw new BadRequestError('Нельзя удалять чужую карточку');
      }
      return Card.findByIdAndRemove(cardId);
    })
    .then((card) => res.status(STATUS_OK).send({ message: `Карточка '${card.name}' удалена` }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: 'введен некорректный id карточки' });
      }
      if (err instanceof NotFoundError) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      next(err);
    });
};

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
      res.status(STATUS_OK).send({ card });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: 'введен некорректный id карточки' });
      }
      next(err);
    });
};

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
      res.status(STATUS_OK).send({ card });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: 'введен некорректный id карточки' });
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
