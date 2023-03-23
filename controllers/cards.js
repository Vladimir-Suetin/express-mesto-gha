const Card = require('../models/card');

const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/serverStatus');

const BadRequestError = require('../errors/badRequestError');
const InternalServerError = require('../errors/internalServerError');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(STATUS_OK).send({ cards }))
    .catch((err) => {
      if (err.name === InternalServerError) {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: err.message });
      }
    });
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_CREATED).send({ card }))
    .catch((err) => {
      if (err.name === BadRequestError) {
        res.status(STATUS_BAD_REQUEST).send({ message: 'При создании карточки произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params.id;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      res.status(200).send({ message: `Card '${card.name}' deleted` });
    })
    .catch((err) => {
      if (err.name === BadRequestError) {
        res.status(STATUS_BAD_REQUEST).send({ message: 'При удалении карточки произошла ошибка' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.status(STATUS_CREATED).send({ card }))
    .catch((err) => {
      if (err.name === BadRequestError) {
        res.status(STATUS_BAD_REQUEST).send({ message: 'При добавлении лайка произошла ошибка' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.status(STATUS_CREATED).send({ card }))
    .catch((err) => {
      if (err.name === BadRequestError) {
        res.status(STATUS_BAD_REQUEST).send({ message: 'При удалении лайка произошла ошибка' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
