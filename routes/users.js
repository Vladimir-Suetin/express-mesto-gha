const router = require('express').Router();
const { getUsers, getUser, createUser, login, updateUser, updateAvatar, getCurrentUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', auth, getUsers);
router.get('/:id', auth, getUser);
router.get('/me', auth, getCurrentUser);
router.post('/signup', createUser);
router.post('/signin', login);
router.patch('/me', auth, updateUser);
router.patch('/me/avatar', auth, updateAvatar);

module.exports = router;
