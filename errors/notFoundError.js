const { STATUS } = require('../utils/serverStatus');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS.NOT_FOUND;
  }
}

module.exports = NotFoundError;
