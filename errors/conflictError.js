const { STATUS } = require('../utils/serverStatus');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS.CONFLICT;
  }
}

module.exports = ConflictError;
