import faker from "faker";
import puppeteer from "puppeteer";
import BrowserFactory from "../helpers/browserFactory";
import AccountLoginPage from "../helpers/pages/accountLoginPage";

let page;
let browser;

jest.setTimeout(60000);

afterAll(() => {
    browser.close();
});

describe("Registration", () => {
    describe("Desktop Browser", () => {
        it("should load a  desktop browser", async () => {
            browser = await BrowserFactory.setupDesktopBrowser();
            page = await BrowserFactory.newDesktopPage(browser);
        });
        it(
            "Should navigate to the login page and register a user",
            async () => {
                    reporter
                        .description("Homepage test suite")
                        .story("JIRA001");
                    let login = new AccountLoginPage(page);
                    await login.gotoPage();
                    await login.selectLogin();
                    await login.enterUserDetails();
                    const screen = await page.screenshot();
                    reporter.addAttachment("ScreenShot", screen, "image/png");
                    reporter.endStep();
                },
                16000
        );
        it("should close the browser", () => {
            browser.close();
        });
    });
});
