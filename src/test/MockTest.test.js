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

let page;
let mck;
let browser;

describe('Login page mocking', () => {
  beforeAll(async () => {
    browser = await BrowserFactory.setupDesktopBrowser();
    page = await BrowserFactory.newDesktopPage(browser);
    mck = new Mocker(page, BASE_URL, BASE_API);
    mck.mocker();
  });

  it(
    'login to mocked user',
    async () => {
      mck.mock(false, LOGIN_API, loginResponse, 200, 'POST');
      mck.mock(false, ACCOUNT_DETAIL_API, validUser);

      const login = new AccountLoginPage(page);
      await login.gotoPage();

      // await page.pdf({ path: 'log/test.pdf', format: 'A4' }); // Headless

      await page.waitFor(5000);
    },
    timeOut
  );

  afterAll(async () => {
    await browser.close();
  });
});
