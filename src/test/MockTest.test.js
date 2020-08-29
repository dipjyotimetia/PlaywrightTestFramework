/** @type {import('playwright').Browser} * */
let browser;

/** @type {import('playwright').Page} * */
let page;

import Mocker from '../helpers/Mocker';
import BrowserFactory from '../helpers/BrowserFactory';
import AccountLoginPage from '../pages/AccountLoginPage';
import {
  BASE_URL,
  BASE_API,
  LOGIN_API,
  ACCOUNT_DETAIL_API,
} from '../config/config';

const loginResponse = require('../mock/loginResponse.json');
const validUser = require('../mock/validUser.json');

jest.setTimeout(60000);
const timeOut = 56000;

describe('Login page mocking', () => {
  beforeAll(async () => {
    browser = await BrowserFactory.setupDesktopBrowser();
    page = await BrowserFactory.newDesktopPage(browser);
  });

  it(
    'login to mocked user',
    async () => {
      await page.route('**/api/account/login', request => {
        request.respond({
          status: 200,
          body: loginResponse,
        });
      });

      await page.route('**/api/account/detail', request => {
        request.respond({
          status: 200,
          body: validUser,
        });
      });

      const login = new AccountLoginPage(page);
      await login.gotoPage();

      // await page.pdf({ path: 'log/test.pdf', format: 'A4' }); // Headless
    },
    timeOut
  );

  afterAll(async () => {
    await browser.close();
  });
});
