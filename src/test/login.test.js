import faker from "faker";
import puppeteer from "puppeteer";
import BrowserFactory from "../helpers/browserFactory";
import AccountLoginPage from "../pages/accountLoginPage";

let page;
let browser;

jest.setTimeout(60000);

describe("Login", () => {

    beforeAll(async () => {
        browser = await BrowserFactory.setupDesktopBrowser();
        page = await BrowserFactory.newDesktopPage(browser);
    });

    it(
        "Should navigate to the login page and login a user",
        async () => {
            reporter
                .description("Login test suite")
                .story("JIRA001")
                .addEnvironment("Test Env", "PROD");
            reporter.startStep("Test Login");
            // await page.tracing.start({
            //     path: './trace.json'
            // });
            let login = new AccountLoginPage(page);
            await login.gotoPage();
            await login.selectLogin();
            await login.enterUserDetails();
            const screen = await page.screenshot();
            reporter.addAttachment("ScreenShot", screen, "image/png");
            reporter.endStep();
            // await page.tracing.stop();
            // const performanceTiming = JSON.parse(
            //     await page.evaluate(() => JSON.stringify(window.performance.timing))
            // );
            // console.log(performanceTiming);
        },
        16000
    );

    afterAll(async () => {
        browser.close();
    });
});
