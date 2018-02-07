import faker from "faker";
import puppeteer from "puppeteer";
import BrowserFactory from "../helpers/browserFactory";
import ProductPage from "../helpers/pages/productPage";

let page;
let browser;
let productPage;

jest.setTimeout(25000);

afterAll(() => {
    browser.close();
});

describe("Add to bag functionality", () => {
  let addToBagStatus;
  describe("Add to bag Desktop", () => {
    test("SETUP: navigate to product page", async () => {
      browser = await BrowserFactory.setupDesktopBrowser();
      page = await BrowserFactory.newDesktopPage(browser);
      productPage = new ProductPage(page);
      await productPage.gotoPage();
    });
    test("Add product to bag serves 200 response from AJAX request", async () => {

      return productPage.addToBagAjaxResponsePromise().then( (response) => {
        expect(response.status()).toBe(200);
      });

      await poductPage.addToBag();
    });
    test("TEARDOWN", () => {
      browser.close();
    })
  });
  describe("Add to bag mobile", () => {
    test("SETUP: navigate to product page", async () => {
      browser = await BrowserFactory.setupMobileBrowser();
      page = await BrowserFactory.newMobilePage(browser);
      productPage = new ProductPage(page);
      await productPage.gotoPage();
    });
    test("Add product to bag serves 200 response from AJAX request", async () => {

      return productPage.addToBagAjaxResponsePromise().then( (response) => {
        expect(response.status()).toBe(200);
      });

      await productPage.addToBag();
    });
    test("TEARDOWN", () => {
      browser.close();
    });
  });
});