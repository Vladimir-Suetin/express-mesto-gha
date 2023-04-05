const jsonwebtoken = require('jsonwebtoken');
// const Unauthorized = require('../errors/unauthorized');
const { STATUS_UNAUTHORIZED } = require('../utils/serverStatus');

const { JWT_SECRET } = require('../config');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    // throw new Unauthorized('Необходима авторизация');
    return res.status(STATUS_UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
  const jwt = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    // throw new Unauthorized('Необходима авторизация');
    return res.status(STATUS_UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;

  next();
};

module.exports = auth;
