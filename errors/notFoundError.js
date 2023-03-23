const { STATUS_NOT_FOUND } = require('../utils/serverStatus');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_NOT_FOUND;
  }
}

module.exports = NotFoundError;
