import faker from "faker";
import puppeteer from "puppeteer";
import BrowserFactory from "../helpers/browserFactory";
import AccountLoginPage from "../helpers/pages/accountLoginPage";

let page;
let browser;

jest.setTimeout(25000);

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
                let login = new AccountLoginPage(page);
                await login.gotoPage();
                await login.selectRegister();
                await login.enterUserDetails();
                await login.enterPasswords({
                    password: "ValidPw123",
                    confirmation: "ValidPw123"
                });
                await login.submitForm();
            },
            16000
        );
        it("should close the browser", () => {
            browser.close();
        });
    });
    describe("Mobile Browser", () => {
        it("should load a mobile browser", async () => {
            browser = await BrowserFactory.setupMobileBrowser();
            page = await BrowserFactory.newMobilePage(browser);
        });
        it(
            "Should navigate to the login page and register a user",
            async () => {
                let login = new AccountLoginPage(page);
                await login.gotoPage();
                await login.selectRegister();
                await login.enterUserDetails();
                await login.enterPasswords({
                    password: "ValidPw123",
                    confirmation: "ValidPw123"
                });
                await login.submitForm();
            },
            16000
        );
        it("should close the browser", () => {
            browser.close();
        });
    });
});
