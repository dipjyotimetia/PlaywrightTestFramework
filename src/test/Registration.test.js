/* eslint-disable no-undef */
import BrowserFactory from '../helpers/BrowserFactory';
import AccountRegistrationPage from '../pages/AccountRegistrationPage';

const PuppeteerHar = require('puppeteer-har');

const timeOut = 56000;
let page;
let browser;

jest.setTimeout(60000);

describe('Test Registration Scenario', () => {
  beforeAll(async () => {
    browser = await BrowserFactory.setupDesktopBrowser();
    page = await BrowserFactory.newDesktopPage(browser);
  });

  it(
    'Should navigate to the join now page and register a user',
    async () => {
      const reg = new AccountRegistrationPage(page);
      await reg.gotoPage();
      await reg.joinNow();
      await reg.enterDetails();
    },
    timeOut
  );

  afterAll(async () => {
    await browser.close();
  });
});
