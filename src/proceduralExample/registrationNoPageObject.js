import faker from "faker";
import puppeteer from "puppeteer";
//import browserProfile from exports;

const baseUrl = "https://www-staging.mgnonprod.co.uk";
const path = "/customer/account/login/";

const userData = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    dob: "01011990",
    password: faker.internet.password(8,1)
};

let page;
let browser;
const width = 768;
const height = 1080;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// browserProfile.setDesktop

beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // headless config from command line?
      //slowMo: 80,
      args: [`--window-size=${width},${height}`]
    });
    page = await browser.newPage();
    await page.setViewport({ width, height });
});

afterAll(() => {
    browser.close();
});

describe("Register Page", () => {
    test("New user ", async () => {
      await page.goto(baseUrl + path);
      await page.waitForSelector("#register-tab");
      await page.click("#register-tab");
      await page.click("#firstname");
      await page.type("#firstname", userData.firstName);
      await page.click("#lastname");
      await page.type("#lastname", userData.lastName);
      await page.click("#email");
      await page.type("#email", userData.email);
      await page.click("#birth_date");
      await page.type("#birth_date", userData.dob);
      await page.click("#password");
      await page.type("#password", userData.password);
      await page.click("#confirmation");
      await page.type("#confirmation", userData.password);
      await page.waitForSelector("#register");
      await page.click("#register");
      await page.waitForSelector("#section-heading");
      //const text = await page.$$(".dashboard__details dd:nth-child(2)").getProperty('value');
      
      //console.log(text);
      //expect(await page.$$("#dashboard__details dd:nth-child(2)").getProperty('value')).toBe(userData.email);

    }, 16000);
  });

  