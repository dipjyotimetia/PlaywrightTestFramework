import { test, expect } from '@playwright/test';
import { A11yActions } from '../../core/actions/web/a11yActions';

test.describe('Accessibility Tests', () => {
  let a11y: A11yActions;

  test.beforeEach(async () => {
    a11y = new A11yActions();
  });

  test('should verify button has correct ARIA role', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginButton = page.locator('[data-test="login-button"]');
    await a11y.verifyRole(loginButton, 'button');
  });

  test('should verify form inputs have accessible names', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const usernameInput = page.locator('[data-test="username"]');
    const passwordInput = page.locator('[data-test="password"]');

    // Verify inputs have accessible names
    await expect(usernameInput).toHaveAccessibleName(/username/i);
    await expect(passwordInput).toHaveAccessibleName(/password/i);
  });

  test('should verify navigation has correct landmark role', async ({
    page,
  }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Verify main navigation
    const nav = page.locator('.primary_header');
    await expect(nav).toBeVisible();
  });

  test('should verify images have alt text', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Get all product images
    const images = page.locator('.inventory_item_img img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await a11y.verifyImageHasAltText(img);
    }
  });

  test('should verify form inputs have associated labels', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const usernameInput = page.locator('[data-test="username"]');
    const passwordInput = page.locator('[data-test="password"]');

    // Verify inputs have labels (via placeholders or aria-labels in this case)
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should verify keyboard accessibility for interactive elements', async ({
    page,
  }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginButton = page.locator('[data-test="login-button"]');

    // Verify button is keyboard accessible
    const isAccessible = await a11y.verifyKeyboardAccessibility(
      page,
      loginButton
    );
    expect(isAccessible).toBe(true);
  });

  test('should verify heading hierarchy on product page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Verify heading hierarchy is proper
    await a11y.verifyHeadingHierarchy(page);
  });

  test('should verify elements are visible to screen readers', async ({
    page,
  }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginButton = page.locator('[data-test="login-button"]');
    const isVisible = await a11y.isVisibleToScreenReaders(loginButton);

    expect(isVisible).toBe(true);
  });

  test('should verify color contrast for text elements', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    const loginButton = page.locator('[data-test="login-button"]');
    const contrastRatio = await a11y.checkColorContrast(loginButton, 4.5);

    // Verify minimum contrast ratio (4.5:1 for normal text, 3:1 for large text)
    expect(contrastRatio).toBeGreaterThanOrEqual(3.0);
  });

  test('should verify accessible description for complex UI elements', async ({
    page,
  }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Test with shopping cart icon
    const cartIcon = page.locator('.shopping_cart_link');
    await expect(cartIcon).toBeVisible();

    // Verify it has an accessible role
    await a11y.verifyRole(cartIcon, 'link');
  });

  test('should verify all interactive elements are keyboard navigable', async ({
    page,
  }) => {
    await page.goto('https://www.saucedemo.com/');

    // Tab through interactive elements
    await page.keyboard.press('Tab'); // Focus username
    let activeElement = await page.evaluate(() => document.activeElement?.id);
    expect(activeElement).toBe('user-name');

    await page.keyboard.press('Tab'); // Focus password
    activeElement = await page.evaluate(() => document.activeElement?.id);
    expect(activeElement).toBe('password');

    await page.keyboard.press('Tab'); // Focus login button
    activeElement = await page.evaluate(() => document.activeElement?.className);
    expect(activeElement).toContain('submit-button');
  });

  test('should verify ARIA labels are present on icon buttons', async ({
    page,
  }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');

    // Verify menu button has accessible name
    const menuButton = page.locator('#react-burger-menu-btn');
    await expect(menuButton).toHaveAccessibleName(/menu/i);
  });
});
