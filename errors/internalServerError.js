const { STATUS_INTERNAL_SERVER_ERROR } = require('../utils/serverStatus');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_INTERNAL_SERVER_ERROR;
    this.message = message || 'ошибка сервера';
  }
}

module.exports = InternalServerError;
