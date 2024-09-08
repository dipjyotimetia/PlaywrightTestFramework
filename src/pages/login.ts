import { Page } from '@playwright/test';
import { TestInfo } from '@playwright/test';
import { AppConfig } from '../config/config';

/**
 * Navigates to the login page, fills in the email and password fields, and submits the form.
 * Attaches a screenshot of the page as a test artifact.
 * Waits for a specified duration.
 * Throws an error if any error occurs during the execution.
 * @param page - The Playwright Page object representing the browser page.
 * @param testInfo - The Playwright TestInfo object containing information about the test.
 */
export const LoginPage = async (page: Page, testInfo: TestInfo) => {
  try {
    // Navigate to the website
    await page.goto('https://react-redux.realworld.io/');

    // Log page title
    console.log('Page title:', await page.title());

    // Click the login link
    await page.click('[href="#login"]');

    // Fill in email and password fields
    await page.fill('input[type="email"]', 'testauto@gmail.com');
    await page.fill('input[type="password"]', 'Password1');

    // Click the submit button
    await page.click('button[type="submit"]');

    // Attach a screenshot as a test artifact
    await testInfo.attach('LoginPageScreenshot', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });

    // Wait for a moment (you can adjust the duration)
    await page.waitForTimeout(8000);
  } catch (error) {
    // Capture a screenshot on error
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
    throw error; // Rethrow the error to fail the test
  }
};
