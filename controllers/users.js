const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const getUser = (req, res) => {
  const { id } = req.params;
  console.log(id);

  return User.findById(id)
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const createUser = (req, res) => {
  User.create({ ...req.body })
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
