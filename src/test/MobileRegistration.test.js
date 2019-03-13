/* eslint-disable no-undef */
import BrowserFactory from '../helpers/BrowserFactory';
import AccountRegistrationPage from '../pages/AccountRegistrationPage';

const timeOut = 56000;
let page;
let browser;

jest.setTimeout(60000);

describe('Test Registration Scenario in Mobile', () => {
  beforeAll(async () => {
    browser = await BrowserFactory.setupDesktopBrowser();
    page = await BrowserFactory.newIphoneXPage(browser);
  });

  it(
    'Should navigate to the join now page and register a user',
    async () => {
      reporter
        .description('Registration test suite for mobile')
        .story('JIRA004')
        .addEnvironment('Test Env', 'PROD');
      reporter.startStep('Test Registration in mobile');

      const reg = new AccountRegistrationPage(page);
      await reg.gotoPage();
      await reg.joinNow();
      await reg.enterDetails();

      const screen = await page.screenshot();
      reporter.addAttachment('ScreenShot', screen, 'image/png');
      reporter.endStep();
    },
    timeOut
  );

  afterAll(async () => {
    await browser.close();
  });
});
