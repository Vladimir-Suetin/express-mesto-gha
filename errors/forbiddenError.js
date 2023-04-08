const { STATUS } = require('../utils/serverStatus');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
