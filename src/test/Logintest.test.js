/* eslint-disable no-undef */

import BrowserFactory from '../helpers/BrowserFactory';
import AccountLoginPage from '../pages/AccountLoginPage';

const timeOut = 56000;
let page;
let browser;

jest.setTimeout(60000);

describe('Test Login Scenario', () => {
  beforeAll(async () => {
    browser = await BrowserFactory.setupDesktopBrowser();
    page = await BrowserFactory.newDesktopPage(browser);
  });

  it(
    'Should navigate to the login page and login a user',
    async () => {
      const login = new AccountLoginPage(page);
      await login.gotoPage();
      await login.selectLogin();
      await login.enterUserDetails();

      const performanceTiming = JSON.parse(
        await page.evaluate(() => JSON.stringify(window.performance.timing))
      );
      console.log(performanceTiming);
    },
    timeOut
  );

  afterAll(async () => {
    await browser.close();
  });
});
