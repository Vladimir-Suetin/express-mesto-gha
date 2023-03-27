const Card = require('../models/card');

const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/serverStatus');

const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(STATUS_OK).send({ cards }))
    .catch((err) => {
      res.status(STATUS_INTERNAL_SERVER_ERROR);
      console.log({ message: err.message });
    });
};

const createCard = (req, res) => {
  const user = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner: user })
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Ошибка при создании карточки');
      }
      res.status(STATUS_CREATED).send({ card });
    })
    .catch((err) => {
      if (err instanceof BadRequestError) {
        return res.status(err.statusCode).send({
          message: err.message,
        });
      }
      if (err.name === 'ValidationError') {
        return res.status(STATUS_BAD_REQUEST).send({
          message: err.message,
        });
      }
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).send({
          message: err.message,
        });
      }
      return err;
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params.id;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка id: ${cardId} не найдена`);
      }
      if (card.owner !== req.user._id) {
        throw new BadRequestError('Карточка принадлежит другому пользователю');
      }
      res.status(STATUS_OK).send({ message: `Карточка '${card.name}' удалена` });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err instanceof BadRequestError) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      return err;
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate('likes')
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка id: ${cardId} не найдена`);
      }
      res.status(STATUS_CREATED).send({ card });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: 'введен некорректный id карточки' });
      }
      return err;
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка id: ${cardId} не найдена`);
      }
      res.status(STATUS_CREATED).send({ card });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(STATUS_BAD_REQUEST).send({ message: 'введен некорректный id карточки' });
      }
      return err;
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
