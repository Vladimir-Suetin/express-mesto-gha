const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { STATUS_NOT_FOUND } = require('../utils/serverStatus');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use((req, res) => {
  res.status(STATUS_NOT_FOUND).send({ error: 'Что то пошло не так' });
});

module.exports = router;
