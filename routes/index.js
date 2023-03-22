const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use((req, res) => {
  res.status(404).send({ error: 'Что то пошло не так' });
});

module.exports = router;
