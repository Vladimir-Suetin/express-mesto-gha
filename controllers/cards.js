const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => res.status(200).send({ message: `Card '${card.name}' deleted`}))
    // .then((card) => console.log(card.name))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
};
