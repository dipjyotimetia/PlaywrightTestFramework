class BasePage {

  constructor(page) {
    this.page = page;
    this.config = require('../config/config.json');
  }

  get url() {
    return this.config.url.protocol + this.config.url.domain;
  }
}

export default BasePage;