const { STATUS_UNAUTHORIZED } = require('../utils/serverStatus');

class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_UNAUTHORIZED;
  }
}

module.exports = Unauthorized;
