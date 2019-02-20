import puppeteer from 'puppeteer';
import devices from 'puppeteer/DeviceDescriptors';
const iPhone8plus = devices['iPhone 8 Plus'];
const iPhoneX = devices['iPhone X'];
const pixel2xl = devices['Pixel 2 XL'];
const iPadPro = devices['iPad Pro'];

const desktopResolution = {
  width: 1366,
  height: 768
};

const mobileResolution = {
  width: 375,
  height: 812
};

export const BrowserFactory = {

  setupDesktopBrowser: async () => {
    const browser = await puppeteer.launch(process.env.DEBUG ?
      {
        headless: false,
        args: [`--no-sandbox`, '--start-maximized', '--disable-setuid-sandbox', `--disable-infobars`],
        slowMo: 500,
        devtools: true
      } : {
        headless: true,
        // args: [`--start-maximized`, `--window-size=${desktopResolution.width},${desktopResolution.height}`, '--no-sandbox']
        args: [`--no-sandbox`, '--start-maximized', '--disable-setuid-sandbox', `--disable-infobars`,`--single-process`],
        executablePath: process.env.CHROME_BIN || null,
        ignoreHTTPSErrors: true,
        dumpio: false
      });
    return browser;
  },

  setupMobileBrowser: async () => {
    const browser = await puppeteer.launch(process.env.DEBUG ?
      {
        headless: false,
        args: [`--no-sandbox`, '--start-maximized', '--disable-setuid-sandbox', `--disable-infobars`],
        slowMo: 500,
        devtools: true
      } : {
        headless: false,
        // args: [`--window-size=${mobileResolution.width},${mobileResolution.height}`],
        executablePath: process.env.CHROME_BIN || null,
        ignoreHTTPSErrors: true,
        dumpio: false
      });
    return browser;
  },

  newDesktopPage: async browser => {
    const context = browser.defaultBrowserContext();
    await context.clearPermissionOverrides();
    await context.overridePermissions('https://' + process.env.NODE_ENV, ['geolocation']);
    const page = await context.newPage();
    await page.setViewport({
      width: desktopResolution.width,
      height: desktopResolution.height
    });
    return page;
  },

  newMobilePage: async browser => {
    const context = browser.defaultBrowserContext();
    await context.clearPermissionOverrides();
    await context.overridePermissions('https://' + process.env.NODE_ENV, ['geolocation']);
    const page = await context.newPage();
    await page.setViewport({
      width: mobileResolution.width,
      height: mobileResolution.height,
      isMobile: true,
      hasTouch: true
    });
    return page;
  },

  newIphone8Page: async browser => {
    const context = browser.defaultBrowserContext();
    await context.clearPermissionOverrides();
    await context.overridePermissions('https://' + process.env.NODE_ENV, ['geolocation']);
    const page = await context.newPage();
    await page.emulate(iPhone8plus);
    return page;
  },

  newIphoneXPage: async browser => {
    const context = browser.defaultBrowserContext();
    await context.clearPermissionOverrides();
    await context.overridePermissions('https://' + process.env.NODE_ENV, ['geolocation']);
    const page = await context.newPage();
    await page.emulate(iPhoneX);
    return page;
  },

  newPixel2Page: async browser => {
    const context = browser.defaultBrowserContext();
    await context.clearPermissionOverrides();
    await context.overridePermissions('https://' + process.env.NODE_ENV, ['geolocation']);
    const page = await context.newPage();
    await page.emulate(pixel2xl);
    return page;
  },

  newIpadPro: async browser => {
    const context = browser.defaultBrowserContext();
    await context.clearPermissionOverrides();
    await context.overridePermissions('https://' + process.env.NODE_ENV, ['geolocation']);
    const page = await context.newPage();
    await page.emulate(iPadPro);
    return page;
  },
};

module.exports = BrowserFactory;
