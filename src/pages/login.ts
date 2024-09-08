import { Page, expect, TestInfo } from '@playwright/test';

const selectors = {
  username: 'input[data-test="username"]',
  password: 'input[data-test="password"]',
  loginButton: 'input[data-test="login-button"]',
};

/**
 * Login to the website using Playwright's API.
 * @param page - The Playwright `Page` object representing the webpage.
 * @param testInfo - The Playwright `TestInfo` object containing information about the test.
 * @returns {Promise<void>}
 */
export const LoginPage = async (page: Page, testInfo: TestInfo) => {
  try {
    await page.goto('https://www.saucedemo.com/');
    console.log('Page title:', await page.title());
    await page.fill(selectors.username, 'standard_user');
    await page.fill(selectors.password, 'secret_sauce');
    await page.click(selectors.loginButton);
    await testInfo.attach('LoginPageScreenshot', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
    await page.waitForTimeout(1000);
  } catch (error) {
      await testInfo.attach('ErrorScreenshot', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    throw error;
  }
};
