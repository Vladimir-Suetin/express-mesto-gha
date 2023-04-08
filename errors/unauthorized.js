const { STATUS } = require('../utils/serverStatus');

class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS.UNAUTHORIZED;
  }
}

module.exports = Unauthorized;
