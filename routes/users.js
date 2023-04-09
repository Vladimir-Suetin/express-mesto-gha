const router = require('express').Router();
const {
  getUsers,
  getUser,
  getCurrentUser,
  // login,
  // createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', auth, getUsers);
router.get('/me', auth, getCurrentUser);
// router.post('/signup', createUser);
// router.post('/signin', login);
router.patch('/me', auth, updateUser);
router.patch('/me/avatar', auth, updateAvatar);
router.get('/:id', auth, getUser);

module.exports = router;
