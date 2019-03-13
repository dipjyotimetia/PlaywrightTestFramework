/* eslint-disable global-require */
class BasePage {
  constructor(page) {
    this.page = page;
    this.config = require('../config/config.json');
  }

  get url() {
    return this.config.url.protocol + process.env.NODE_ENV;
  }
}

export default BasePage;
