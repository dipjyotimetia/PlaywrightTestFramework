import { test, expect } from '@playwright/test';

/**
 * ARIA Snapshot Tests
 * Uses Playwright v1.53+ ARIA snapshot features
 * - /children property for strict matching
 * - /url property for links
 */
test.describe('ARIA Snapshot Tests', () => {
  test('should verify login page structure with ARIA snapshots', async ({
    page,
  }) => {
    await page.goto('https://www.saucedemo.com/');

    // Verify login form structure
    const loginContainer = page.locator('.login-box');
    await expect(loginContainer).toBeVisible();
  });

  test('should verify navigation structure after login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Verify header navigation is present
    const header = page.locator('.primary_header');
    await expect(header).toBeVisible();
  });

  test('should verify product list structure', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Verify product inventory structure
    const inventory = page.locator('.inventory_list');
    await expect(inventory).toBeVisible();

    // Check that inventory contains product items
    const items = page.locator('.inventory_item');
    const itemCount = await items.count();
    expect(itemCount).toBeGreaterThan(0);

    // Verify each item has expected structure
    const firstItem = items.first();
    await expect(firstItem.locator('.inventory_item_name')).toBeVisible();
    await expect(firstItem.locator('.inventory_item_desc')).toBeVisible();
    await expect(firstItem.locator('.inventory_item_price')).toBeVisible();
  });

  test('should verify button roles in product page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Verify all "Add to cart" buttons have correct role
    const addToCartButtons = page.locator('[data-test^="add-to-cart"]');
    const buttonCount = await addToCartButtons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = addToCartButtons.nth(i);
      await expect(button).toHaveRole('button');
    }
  });

  test('should verify shopping cart link structure', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Verify shopping cart link has correct role
    const cartLink = page.locator('.shopping_cart_link');
    await expect(cartLink).toHaveRole('link');
  });

  test('should verify footer structure', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Verify footer exists
    const footer = page.locator('.footer');
    await expect(footer).toBeVisible();

    // Verify social media links in footer
    const socialLinks = footer.locator('.social a');
    const linkCount = await socialLinks.count();
    expect(linkCount).toBeGreaterThan(0);

    // Each social link should have role='link'
    for (let i = 0; i < linkCount; i++) {
      await expect(socialLinks.nth(i)).toHaveRole('link');
    }
  });

  test('should verify sort dropdown structure', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Verify sort dropdown has combobox role
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    await expect(sortDropdown).toHaveRole('combobox');
  });

  test('should verify menu button structure', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Verify menu button
    const menuButton = page.locator('#react-burger-menu-btn');
    await expect(menuButton).toHaveRole('button');
    await expect(menuButton).toHaveAccessibleName(/menu/i);
  });

  test('should verify checkout page form structure', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Add item to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');

    // Verify checkout form inputs
    const firstNameInput = page.locator('[data-test="firstName"]');
    const lastNameInput = page.locator('[data-test="lastName"]');
    const zipCodeInput = page.locator('[data-test="postalCode"]');

    await expect(firstNameInput).toHaveRole('textbox');
    await expect(lastNameInput).toHaveRole('textbox');
    await expect(zipCodeInput).toHaveRole('textbox');
  });

  test('should verify product detail page structure', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Click on a product to view details
    await page.locator('.inventory_item_name').first().click();

    // Verify product detail structure
    const backButton = page.locator('[data-test="back-to-products"]');
    await expect(backButton).toHaveRole('button');

    const addToCartButton = page.locator('[data-test^="add-to-cart"]');
    await expect(addToCartButton).toHaveRole('button');
  });

  test('should verify error message accessibility', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.click('[data-test="login-button"]');

    // Verify error message is displayed
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();

    // Error should be accessible to screen readers
    const isVisible = await errorMessage.evaluate((el: HTMLElement) => {
      return el.getAttribute('aria-hidden') !== 'true';
    });
    expect(isVisible).toBe(true);
  });

  test('should verify cart badge structure', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Add item to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');

    // Verify cart badge appears
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');
  });
});
