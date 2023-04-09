const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
// const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/notFoundError');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
// router.post('/users/signup', createUser);
// router.post('/users/signin', login);

// router.use('*', (req, res, next) => {
//   next(new NotFoundError(`страницы ${req.baseUrl} не существует`));
// });

module.exports = router;
