import { test, expect } from '@playwright/test';
import {
  navigateToUrl,
  clickElement,
  fillInputField,
  getElementText,
  isElementVisible,
  waitForElement,
  takeScreenshot,
  getPageTitle,
  selectDropdownOption,
  checkElement,
  isElementChecked,
  doubleClickElement,
  hoverOverElement,
  getElementCount,
  getAllTextContent,
  scrollToBottom,
  wait,
  getLocalStorageItem,
  setLocalStorageItem,
  getCurrentUrl,
  reloadPage,
  isElementEnabled,
  getInputValue,
  executeScript,
  getElementAttributeValue,
  waitForPageLoad,
  getCSSProperty,
  dragAndDrop,
  pressKey,
  focusElement,
  getInnerText,
  uploadFile,
  setViewportSize,
  handleDialog,
  mockApiResponse,
  waitForResponse,
} from '../../../core/actions/web/webActions';

test.describe('Web Actions - Basic Interactions', () => {
  test.skip('Navigate and verify page title', async ({ page }) => {
    await navigateToUrl(page, 'https://playwright.dev');

    const title = await getPageTitle(page);
    expect(title).toContain('Playwright');

    const url = getCurrentUrl(page);
    expect(url).toBe('https://playwright.dev/');
  });

  test.skip('Fill form and submit', async ({ page }) => {
    await navigateToUrl(page, 'https://practice.expandtesting.com/login');

    await fillInputField(page, '#username', 'practice');
    await fillInputField(page, '#password', 'SuperSecretPassword!');

    await clickElement(page, 'button[type="submit"]');

    await waitForPageLoad(page, 'networkidle');
    await takeScreenshot(page, './screenshots/after-login.png');
  });

  test.skip('Work with dropdowns', async ({ page }) => {
    await navigateToUrl(page, 'https://practice.expandtesting.com/dropdown');

    await selectDropdownOption(page, '#dropdown', { index: 1 });

    await wait(page, 1000);

    const selectedValue = await getInputValue(page, '#dropdown');
    console.log('Selected value:', selectedValue);
  });

  test.skip('Checkbox interactions', async ({ page }) => {
    await navigateToUrl(page, 'https://practice.expandtesting.com/checkboxes');

    await checkElement(page, 'input[type="checkbox"]');

    const isChecked = await isElementChecked(page, 'input[type="checkbox"]');
    expect(isChecked).toBeTruthy();
  });
});

test.describe('Web Actions - Element State & Information', () => {
  test.skip('Check element visibility', async ({ page }) => {
    await navigateToUrl(page, 'https://playwright.dev');

    const isLogoVisible = await isElementVisible(page, 'img[alt="Playwright logo"]');
    expect(isLogoVisible).toBeTruthy();

    const navText = await getElementText(page, 'nav');
    console.log('Navigation text:', navText);
  });

  test.skip('Get element count and text', async ({ page }) => {
    await navigateToUrl(page, 'https://playwright.dev');

    const linkCount = await getElementCount(page, 'nav a');
    console.log(`Found ${linkCount} navigation links`);

    const allLinkTexts = await getAllTextContent(page, 'nav a');
    console.log('Link texts:', allLinkTexts);
  });

  test.skip('Get CSS properties', async ({ page }) => {
    await navigateToUrl(page, 'https://playwright.dev');

    const color = await getCSSProperty(page, 'h1', 'color');
    const fontSize = await getCSSProperty(page, 'h1', 'font-size');

    console.log('H1 color:', color);
    console.log('H1 font size:', fontSize);
  });

  test.skip('Get element attributes', async ({ page }) => {
    await navigateToUrl(page, 'https://playwright.dev');

    const href = await getElementAttributeValue(page, 'a', 'href');
    console.log('First link href:', href);
  });
});

test.describe('Web Actions - Advanced Interactions', () => {
  test.skip('Double click example', async ({ page }) => {
    await navigateToUrl(page, 'https://practice.expandtesting.com/double-click');

    await doubleClickElement(page, '#double-click-btn');

    const result = await isElementVisible(page, '#double-click-result');
    expect(result).toBeTruthy();
  });

  test.skip('Hover interaction', async ({ page }) => {
    await navigateToUrl(page, 'https://playwright.dev');

    await hoverOverElement(page, 'nav a');
    await wait(page, 1000);

    await takeScreenshot(page, './screenshots/hover-state.png');
  });

  test.skip('Keyboard actions', async ({ page }) => {
    await navigateToUrl(page, 'https://practice.expandtesting.com/key-presses');

    const input = '#target';

    await focusElement(page, input);
    await pressKey(page, input, 'A');
    await pressKey(page, input, 'Enter');

    const result = await getElementText(page, '#result');
    console.log('Key press result:', result);
  });

  test.skip('Drag and drop', async ({ page }) => {
    await navigateToUrl(page, 'https://practice.expandtesting.com/drag-and-drop');

    await dragAndDrop(page, '#column-a', '#column-b');

    await wait(page, 1000);
    await takeScreenshot(page, './screenshots/after-drag-drop.png');
  });
});

test.describe('Web Actions - Scrolling', () => {
  test.skip('Scroll to bottom', async ({ page }) => {
    await navigateToUrl(page, 'https://playwright.dev');

    await scrollToBottom(page);
    await wait(page, 1000);

    await takeScreenshot(page, './screenshots/bottom-of-page.png');
  });
});

test.describe('Web Actions - Storage Management', () => {
  test.skip('LocalStorage operations', async ({ page }) => {
    await navigateToUrl(page, 'https://practice.expandtesting.com/web-storage');

    await setLocalStorageItem(page, 'testKey', 'testValue');

    await reloadPage(page);

    const value = await getLocalStorageItem(page, 'testKey');
    expect(value).toBe('testValue');
  });
});

test.describe('Web Actions - Viewport & Responsiveness', () => {
  test.skip('Test mobile viewport', async ({ page }) => {
    await setViewportSize(page, 375, 667); // iPhone SE size

    await navigateToUrl(page, 'https://playwright.dev');

    await takeScreenshot(page, './screenshots/mobile-view.png');

    await setViewportSize(page, 1920, 1080); // Desktop
    await takeScreenshot(page, './screenshots/desktop-view.png');
  });
});

test.describe('Web Actions - JavaScript Execution', () => {
  test.skip('Execute custom JavaScript', async ({ page }) => {
    await navigateToUrl(page, 'https://playwright.dev');

    const pageHeight = await executeScript(page, () => {
      return document.body.scrollHeight;
    });

    console.log('Page height:', pageHeight);

    const linkCount = await executeScript(page, () => {
      return document.querySelectorAll('a').length;
    });

    console.log('Total links:', linkCount);
  });

  test.skip('Modify page with JavaScript', async ({ page }) => {
    await navigateToUrl(page, 'https://playwright.dev');

    await executeScript(page, () => {
      const heading = document.querySelector('h1');
      if (heading) {
        heading.style.color = 'red';
      }
    });

    await takeScreenshot(page, './screenshots/modified-page.png');
  });
});

test.describe('Web Actions - File Upload', () => {
  test.skip('Upload file', async ({ page }) => {
    await navigateToUrl(page, 'https://practice.expandtesting.com/upload');

    // Note: You'll need to create a test file first
    await uploadFile(page, '#file-upload', './test-files/sample.txt');

    await clickElement(page, '#file-submit');

    await waitForElement(page, '#uploaded-files');

    const uploadedFile = await getElementText(page, '#uploaded-files');
    expect(uploadedFile).toContain('sample.txt');
  });
});

test.describe('Web Actions - Dialogs', () => {
  test.skip('Handle alert dialog', async ({ page }) => {
    await navigateToUrl(page, 'https://practice.expandtesting.com/javascript-alerts');

    await handleDialog(page, 'accept');
    await clickElement(page, 'button:has-text("Click for JS Alert")');

    await wait(page, 1000);

    const result = await getElementText(page, '#result');
    expect(result).toContain('successfully');
  });

  test.skip('Handle confirm dialog', async ({ page }) => {
    await navigateToUrl(page, 'https://practice.expandtesting.com/javascript-alerts');

    await handleDialog(page, 'dismiss');
    await clickElement(page, 'button:has-text("Click for JS Confirm")');

    await wait(page, 1000);
  });

  test.skip('Handle prompt dialog', async ({ page }) => {
    await navigateToUrl(page, 'https://practice.expandtesting.com/javascript-alerts');

    await handleDialog(page, 'accept', 'Test Input');
    await clickElement(page, 'button:has-text("Click for JS Prompt")');

    await wait(page, 1000);

    const result = await getElementText(page, '#result');
    expect(result).toContain('Test Input');
  });
});

test.describe('Web Actions - Network Mocking', () => {
  test.skip('Mock API response', async ({ page }) => {
    await mockApiResponse(page, '**/api/users', {
      status: 200,
      body: {
        users: [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Smith' },
        ],
      },
    });

    await navigateToUrl(page, 'https://your-app.com');

    const response = await waitForResponse(page, '**/api/users');
    const data = await response.json();

    console.log('Mocked response:', data);
    expect(data.users).toHaveLength(2);
  });
});

test.describe('Web Actions - Waiting Strategies', () => {
  test.skip('Wait for element to appear', async ({ page }) => {
    await navigateToUrl(page, 'https://practice.expandtesting.com/dynamic-loading/1');

    await clickElement(page, 'button');

    await waitForElement(page, '#finish', 10000);

    const isVisible = await isElementVisible(page, '#finish');
    expect(isVisible).toBeTruthy();

    const text = await getElementText(page, '#finish');
    console.log('Final text:', text);
  });

  test.skip('Wait for element to be enabled', async ({ page }) => {
    await navigateToUrl(page, 'https://practice.expandtesting.com/dynamic-controls');

    await clickElement(page, 'button:has-text("Enable")');

    await wait(page, 2000);

    const enabled = await isElementEnabled(page, 'input[type="text"]');
    expect(enabled).toBeTruthy();
  });
});

test.describe('Web Actions - Complex Scenarios', () => {
  test.skip('Complete user registration flow', async ({ page }) => {
    await navigateToUrl(page, 'https://practice.expandtesting.com/register');

    // Fill registration form
    await fillInputField(page, '#username', 'testuser123');
    await fillInputField(page, '#email', 'test@example.com');
    await fillInputField(page, '#password', 'SecurePass123!');
    await fillInputField(page, '#confirm-password', 'SecurePass123!');

    // Select country
    await selectDropdownOption(page, '#country', { label: 'United States' });

    // Accept terms
    await checkElement(page, '#terms');

    // Screenshot before submit
    await takeScreenshot(page, './screenshots/registration-form.png');

    // Submit form
    await clickElement(page, 'button[type="submit"]');

    // Wait for success
    await waitForElement(page, '.success-message');

    const successText = await getElementText(page, '.success-message');
    expect(successText).toContain('successful');
  });

  test.skip('Search and filter products', async ({ page }) => {
    await navigateToUrl(page, 'https://your-ecommerce-site.com');

    // Enter search term
    await fillInputField(page, '#search', 'laptop');
    await pressKey(page, '#search', 'Enter');

    // Wait for results
    await waitForPageLoad(page, 'networkidle');

    // Count results
    const productCount = await getElementCount(page, '.product-card');
    console.log(`Found ${productCount} products`);

    // Get all product names
    const productNames = await getAllTextContent(page, '.product-name');
    console.log('Products:', productNames);

    // Verify all products contain search term
    productNames.forEach((name) => {
      expect(name.toLowerCase()).toContain('laptop');
    });

    // Take screenshot
    await takeScreenshot(page, './screenshots/search-results.png');
  });

  test.skip('Multi-step form with validation', async ({ page }) => {
    await navigateToUrl(page, 'https://your-app.com/multi-step-form');

    // Step 1: Personal Info
    await fillInputField(page, '#firstName', 'John');
    await fillInputField(page, '#lastName', 'Doe');
    await clickElement(page, '#nextStep1');

    // Step 2: Address
    await waitForElement(page, '#address');
    await fillInputField(page, '#address', '123 Main St');
    await fillInputField(page, '#city', 'New York');
    await selectDropdownOption(page, '#state', 'NY');
    await clickElement(page, '#nextStep2');

    // Step 3: Review and Submit
    await waitForElement(page, '#review');

    const reviewText = await getInnerText(page, '#review');
    expect(reviewText).toContain('John');
    expect(reviewText).toContain('Doe');

    await takeScreenshot(page, './screenshots/review-step.png');

    await clickElement(page, '#submit');

    // Verify submission
    await waitForElement(page, '.confirmation');
    const confirmation = await getElementText(page, '.confirmation');
    expect(confirmation).toContain('success');
  });
});
