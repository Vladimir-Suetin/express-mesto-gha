const jsonwebtoken = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');

const { JWT_SECRET } = require('../config');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new Unauthorized('Необходима авторизация');
  }
  const jwt = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    throw new Unauthorized('Необходима авторизация');
  }
  req.user = payload;

  return next();
};

module.exports = auth;
