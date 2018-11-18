import faker from "faker";
import puppeteer from "puppeteer";
import BrowserFactory from "../helpers/browserFactory";
import AccountRegistrationPage from "../pages/accountRegistrationPage";

const timeOut = 36000;
let page;
let browser;

jest.setTimeout(60000);

describe("Registration", () => {

    beforeAll(async () => {
        browser = await BrowserFactory.setupDesktopBrowser();
        page = await BrowserFactory.newDesktopPage(browser);
    });

    it(
        "Should navigate to the joinnow page and register a user",
        async () => {
            reporter
                .description("Registration test suite")
                .story("JIRA002")
                .addEnvironment("Test Env", "PROD");

            reporter.startStep("Test Registration");
            let reg = new AccountRegistrationPage(page);
            await reg.gotoPage();
            await reg.joinNow();
            await reg.enterDetails();
            const screen = await page.screenshot();
            reporter.addAttachment("ScreenShot", screen, "image/png");
            reporter.endStep();
        },
        timeOut
    );

    afterAll(async () => {
        browser.close();
    });
});
