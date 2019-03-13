const _ = require('lodash');
const { getCorsHeaders } = require('../config/cors');

class Mocker {
  constructor(page, url, corsUrl) {
    this.page = page;
    this.mocks = [];
    this.BASE_URL = url;
    this.cors__API_BASE_URL = corsUrl;
  }

  mocker() {
    this.page.setRequestInterception(true);
    this.page.on('request', req => {
      const mock = _.find(this.mocks, ({ finalUrl }) =>
        req.url().includes(finalUrl)
      );
      if (mock) {
        req.respond(mock);
      } else {
        req.continue();
      }
    });
  }

  mock(cors, url, body, status = 200, method = 'GET', headers = {}) {
    let finalUrl = this.BASE_URL.concat(url);
    if (cors) {
      finalUrl = this.cors__API_BASE_URL.concat(url);
    }
    if (body !== null) {
      this.mocks = [
        ...this.mocks,
        {
          finalUrl,
          body: _.isString(body) ? body : JSON.stringify(body),
          status,
          // method,
          contentType: 'application/json; charset=utf-8',
          headers: getCorsHeaders(),
        },
      ];
    }
  }
}

module.exports = Mocker;
