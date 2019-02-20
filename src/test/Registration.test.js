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

  it('Should navigate to the join now page and register a user', async () => {
    reporter
        .description('Registration test suite')
        .story('JIRA002')
        .addEnvironment('Test Env', 'PROD');
    reporter.startStep('Test Registration');

    const har = new PuppeteerHar(page);
    await har.start({ path: 'results.har' });

    const reg = new AccountRegistrationPage(page);
    await reg.gotoPage();
    await reg.joinNow();
    await reg.enterDetails();

    const screen = await page.screenshot();
    reporter.addAttachment('ScreenShot', screen, 'image/png');
    reporter.endStep();

    await har.stop();
  }, timeOut
  );

  afterAll(async () => {
    await browser.close();
  });
});
