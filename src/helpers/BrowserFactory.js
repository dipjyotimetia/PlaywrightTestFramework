import { webkit, chromium, firefox, devices } from 'playwright';

const iPhoneX = devices['iPhone X'];
const iPadPro = devices['iPad Pro'];

const desktopResolution = {
  width: 1600,
  height: 900,
};

const mobileResolution = {
  width: 375,
  height: 812,
};

export const BrowserFactory = {
  setupDesktopBrowser: async () => {
    let browser;
    // eslint-disable-next-line default-case
    switch (process.env.BROWSER) {
      case 'chrome':
        browser = await chromium.launch(
          process.env.DEBUG
            ? {
                headless: false,
              }
            : {
                headless: true,
              }
        );
        break;
      case 'firefox':
        browser = await firefox.launch(
          process.env.DEBUG
            ? {
                headless: false,
              }
            : {
                headless: true,
              }
        );
        break;
      case 'safari':
        browser = await webkit.launch(
          process.env.DEBUG
            ? {
                headless: false,
              }
            : {
                headless: true,
              }
        );
        break;
      default:
        browser = await chromium.launch(
          process.env.DEBUG
            ? {
                headless: false,
              }
            : {
                headless: true,
              }
        );
        break;
    }
    return browser;
  },

  setupMobileBrowser: async () => {
    const browser = await chromium.launch(
      process.env.DEBUG
        ? {
            headless: false,
          }
        : {
            headless: true,
          }
    );
    return browser;
  },

  newDesktopPage: async browser => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio,
    }));
    return page;
  },

  newMobilePage: async browser => {
    const context = await browser.newContext({
      viewport: iPhoneX.viewport,
      userAgent: iPhoneX.userAgent,
      geolocation: { longitude: 12.492507, latitude: 41.889938 },
      permissions: { 'https://www.google.com': ['geolocation'] },
    });
    const page = await context.newPage();
    return page;
  },

  newIphoneXPage: async browser => {
    const context = await browser.newContext({
      viewport: iPhoneX.viewport,
      userAgent: iPhoneX.userAgent,
      geolocation: { longitude: 12.492507, latitude: 41.889938 },
      permissions: { 'https://www.google.com': ['geolocation'] },
    });
    const page = await context.newPage();
    return page;
  },

  newIpadPro: async browser => {
    const context = await browser.newContext({
      viewport: iPadPro.viewport,
      userAgent: iPadPro.userAgent,
      geolocation: { longitude: 12.492507, latitude: 41.889938 },
      permissions: { 'https://www.google.com': ['geolocation'] },
    });
    const page = await context.newPage();
    return page;
  },
};

module.exports = BrowserFactory;
