const loginResponse = require('../mockresponse/loginResponse.json');
const validUser = require('../mockresponse/validUser.json');
import Mocker from '../helpers/Mocker';
import BrowserFactory from '../helpers/browserFactory';
import AccountLoginPage from '../pages/accountLoginPage';

jest.setTimeout(60000);
const timeOut = 56000;
let page;
let mck;
let browser;


describe('Home page', () => {

  beforeAll(async() => {
    browser = await BrowserFactory.setupDesktopBrowser();
    page = await BrowserFactory.newDesktopPage(browser);
    mck = new Mocker(page, 'https://beteasy.com.au', 'https://api.beteasy.com.au');
    mck.mocker();
  });

  test('login to mocked user', async() => {
    mck.mock(false, '/api/account/login', loginResponse, 200, 'POST');
    mck.mock(false, '/api/account/detail', validUser);
    const login = new AccountLoginPage(page);
    await login.gotoPage();
    await login.selectLogin();
    await login.enterUserDetails();
    await page.waitFor(3000);
  }, timeOut);

  afterAll(async() => {
    browser.close();
  });
});
