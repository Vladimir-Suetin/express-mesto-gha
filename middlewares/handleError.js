const { STATUS } = require('../utils/serverStatus');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || STATUS.INTERNAL_SERVER_ERROR;

  const message = statusCode === STATUS.INTERNAL_SERVER_ERROR
    ? `На сервере произошла ошибка: ${err.message}`
    : err.message;

  res.status(statusCode).send({ message });

  next();
};

module.exports = errorHandler;
