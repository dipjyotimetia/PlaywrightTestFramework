import { Page, TestInfo ,expect} from '@playwright/test';
import { faker } from '@faker-js/faker';

const selectors = {
  addToCartBackpack: 'button[data-test="add-to-cart-sauce-labs-backpack"]',
  cartLink: 'a[data-test="shopping-cart-link"]',
  checkoutButton: 'button[data-test="checkout"]',
  firstName: 'input[data-test="firstName"]',
  lastName: 'input[data-test="lastName"]',
  postalCode: 'input[data-test="postalCode"]',
  continueButton: 'input[data-test="continue"]',
  finishButton: 'button[data-test="finish"]',
  backpackText: 'text=Sauce Labs Backpack'
};

/**
 * Add an item to the cart using Playwright's API.
 * @param page - The Playwright `Page` object representing the webpage.
 * @param testInfo - The Playwright `TestInfo` object containing information about the test.
 * @returns {Promise<void>}
 */
export const AddToCart = async (page: Page, testInfo: TestInfo) => {
  const { addToCartBackpack, cartLink } = selectors;

  await page.click(addToCartBackpack);
  await page.click(cartLink);
  const textLocator = page.locator('text=' + "Sauce Labs Backpack");
  await expect(textLocator).toBeVisible();
  await testInfo.attach('AddToCartScreenshot', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
};


/**
 * Checkout using Playwright's API.
 * @param page - The Playwright `Page` object representing the webpage.
 * @param testInfo - The Playwright `TestInfo` object containing information about the test.
 * @returns {Promise<void>}
 */
export const Checkout = async (page: Page, testInfo: TestInfo) => {
  const { checkoutButton, firstName, lastName, postalCode, continueButton, finishButton } = selectors;
  
  await page.click(checkoutButton);
  await page.fill(firstName, faker.person.firstName());
  await page.fill(lastName, faker.person.lastName());
  await page.fill(postalCode, faker.location.zipCode());
  await page.click(continueButton);
  await testInfo.attach('CheckoutScreenshot', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  await page.click(finishButton);
};

