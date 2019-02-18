import BrowserFactory from '../helpers/BrowserFactory';
import AccountLoginPage from '../pages/AccountLoginPage';

const timeOut = 56000;
let page;
let browser;

jest.setTimeout(60000);

describe('Test Login Scenario', () => {

  beforeAll(async() => {
    browser = await BrowserFactory.setupDesktopBrowser();
    page = await BrowserFactory.newDesktopPage(browser);
  });

  it('Should navigate to the login page and login a user', async() => {
    reporter
        .description('Login test suite')
        .story('JIRA001')
        .addEnvironment('Test Env', 'PROD');
    reporter.startStep('Test Login');

    await page.tracing.start({
      path: './trace.json'
    });

    const login = new AccountLoginPage(page);
    await login.gotoPage();
    await login.selectLogin();
    await login.enterUserDetails();

    await page.tracing.stop();
    const performanceTiming = JSON.parse(
        await page.evaluate(() => JSON.stringify(window.performance.timing))
    );
    console.log(performanceTiming);

    const screen = await page.screenshot();
    reporter.addAttachment('ScreenShot', screen, 'image/png');
    reporter.endStep();
  }, timeOut);

  afterAll(async() => {
    await browser.close();
  });
});
