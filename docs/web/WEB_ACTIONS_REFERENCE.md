# Web Actions Reference Guide

Complete reference for all web testing functions in `src/core/webActions.ts`.

## Table of Contents
1. [Navigation](#navigation)
2. [Element Interactions](#element-interactions)
3. [Element State Checks](#element-state-checks)
4. [Element Information](#element-information)
5. [Forms & Inputs](#forms--inputs)
6. [Keyboard Actions](#keyboard-actions)
7. [Mouse Actions](#mouse-actions)
8. [Scrolling](#scrolling)
9. [Screenshots](#screenshots)
10. [Browser & Page Management](#browser--page-management)
11. [Storage (Cookies, LocalStorage, SessionStorage)](#storage)
12. [Iframes & Frames](#iframes--frames)
13. [Dialogs & Alerts](#dialogs--alerts)
14. [File Operations](#file-operations)
15. [Network Management](#network-management)
16. [Advanced Features](#advanced-features)

---

## Navigation

### `navigateToUrl(page, url)`
Navigate to a URL.

```typescript
await navigateToUrl(page, 'https://example.com');
```

### `reloadPage(page, options?)`
Reload the current page.

```typescript
await reloadPage(page, { waitUntil: 'networkidle' });
```

### `goBack(page)`
Navigate back in browser history.

```typescript
await goBack(page);
```

### `goForward(page)`
Navigate forward in browser history.

```typescript
await goForward(page);
```

### `getCurrentUrl(page)`
Get current page URL.

```typescript
const url = getCurrentUrl(page);
console.log('Current URL:', url);
```

### `getPageTitle(page)`
Get page title.

```typescript
const title = await getPageTitle(page);
expect(title).toBe('Expected Page Title');
```

---

## Element Interactions

### `clickElement(page, selector)`
Click an element.

```typescript
await clickElement(page, '#submit-button');
```

### `doubleClickElement(page, selector)`
Double click an element.

```typescript
await doubleClickElement(page, '.file-item');
```

### `rightClickElement(page, selector)`
Right click an element (context menu).

```typescript
await rightClickElement(page, '.context-menu-target');
```

### `hoverOverElement(page, selector)`
Hover over an element.

```typescript
await hoverOverElement(page, '.dropdown-trigger');
```

### `dragAndDrop(page, sourceSelector, targetSelector)`
Drag and drop from source to target.

```typescript
await dragAndDrop(page, '#draggable-item', '#drop-zone');
```

### `clickAndWaitForNavigation(page, selector)`
Click and wait for navigation.

```typescript
await clickAndWaitForNavigation(page, 'a[href="/next-page"]');
```

---

## Element State Checks

### `doesElementExist(page, selector)`
Check if element exists.

```typescript
const exists = await doesElementExist(page, '#optional-element');
if (exists) {
  console.log('Element found');
}
```

### `isElementVisible(page, selector)`
Check if element is visible.

```typescript
const visible = await isElementVisible(page, '#modal');
expect(visible).toBeTruthy();
```

### `isElementHidden(page, selector)`
Check if element is hidden.

```typescript
const hidden = await isElementHidden(page, '#error-message');
expect(hidden).toBeTruthy();
```

### `isElementEnabled(page, selector)`
Check if element is enabled.

```typescript
const enabled = await isElementEnabled(page, '#submit-btn');
expect(enabled).toBeTruthy();
```

### `isElementDisabled(page, selector)`
Check if element is disabled.

```typescript
const disabled = await isElementDisabled(page, '#disabled-input');
expect(disabled).toBeTruthy();
```

### `isElementEditable(page, selector)`
Check if element is editable.

```typescript
const editable = await isElementEditable(page, '#username');
expect(editable).toBeTruthy();
```

### `isElementChecked(page, selector)`
Check if checkbox/radio is checked.

```typescript
const checked = await isElementChecked(page, '#agree-checkbox');
expect(checked).toBeTruthy();
```

---

## Element Information

### `getElementText(page, selector)`
Get element text content.

```typescript
const text = await getElementText(page, '.message');
expect(text).toContain('Success');
```

### `getInnerText(page, selector)`
Get inner text of element.

```typescript
const innerText = await getInnerText(page, '.description');
console.log(innerText);
```

### `getInnerHTML(page, selector)`
Get inner HTML of element.

```typescript
const html = await getInnerHTML(page, '.content');
expect(html).toContain('<span>');
```

### `getElementAttributeValue(page, selector, attributeName)`
Get attribute value.

```typescript
const href = await getElementAttributeValue(page, 'a.link', 'href');
expect(href).toBe('https://example.com');
```

### `getInputValue(page, selector)`
Get input field value.

```typescript
const value = await getInputValue(page, '#email');
expect(value).toBe('user@example.com');
```

### `getAllTextContent(page, selector)`
Get text from all matching elements.

```typescript
const allTexts = await getAllTextContent(page, '.list-item');
console.log('Items:', allTexts);
```

### `getElementCount(page, selector)`
Get count of matching elements.

```typescript
const count = await getElementCount(page, '.product-card');
expect(count).toBe(10);
```

### `getElements(page, selector)`
Get all matching element handles.

```typescript
const elements = await getElements(page, '.checkbox');
console.log(`Found ${elements.length} checkboxes`);
```

### `getElementBoundingBox(page, selector)`
Get element position and size.

```typescript
const box = await getElementBoundingBox(page, '#logo');
console.log(`Position: ${box?.x}, ${box?.y}`);
console.log(`Size: ${box?.width}x${box?.height}`);
```

### `getCSSProperty(page, selector, property)`
Get CSS property value.

```typescript
const color = await getCSSProperty(page, '.heading', 'color');
const fontSize = await getCSSProperty(page, 'h1', 'font-size');
```

---

## Forms & Inputs

### `fillInputField(page, selector, text)`
Fill input field.

```typescript
await fillInputField(page, '#username', 'johndoe');
```

### `clearInputField(page, selector)`
Clear input field.

```typescript
await clearInputField(page, '#search');
```

### `typeText(page, selector, text)`
Type text character by character (with delay).

```typescript
await typeText(page, '#password', 'SecurePassword123');
```

### `checkElement(page, selector)`
Check a checkbox or radio button.

```typescript
await checkElement(page, '#agree-terms');
```

### `uncheckElement(page, selector)`
Uncheck a checkbox.

```typescript
await uncheckElement(page, '#newsletter-opt-in');
```

### `selectDropdownOption(page, selector, option)`
Select dropdown option.

```typescript
// By value
await selectDropdownOption(page, '#country', 'US');

// By label
await selectDropdownOption(page, '#country', { label: 'United States' });

// By index
await selectDropdownOption(page, '#country', { index: 0 });
```

### `selectDropdownOptionByValue(page, selector, value)`
Select dropdown by value.

```typescript
await selectDropdownOptionByValue(page, '#role', 'admin');
```

### `selectText(page, selector)`
Select all text in input.

```typescript
await selectText(page, '#copy-text');
```

### `focusElement(page, selector)`
Focus on an element.

```typescript
await focusElement(page, '#email-input');
```

### `blurElement(page, selector)`
Remove focus from element.

```typescript
await blurElement(page, '#email-input');
```

---

## Keyboard Actions

### `pressEnter(page, selector)`
Press Enter key.

```typescript
await pressEnter(page, '#search-input');
```

### `pressTab(page, selector)`
Press Tab key.

```typescript
await pressTab(page, '#field1');
```

### `pressKey(page, selector, key)`
Press any key or combination.

```typescript
await pressKey(page, '#input', 'Escape');
await pressKey(page, '#input', 'Control+A');
await pressKey(page, '#input', 'Meta+V'); // Command+V on Mac
```

### `pressKeys(page, selector, keys)`
Press multiple keys in sequence.

```typescript
await pressKeys(page, '#input', ['Control+A', 'Delete']);
```

---

## Mouse Actions

### `clickElement(page, selector)`
Standard left click.

```typescript
await clickElement(page, '.button');
```

### `doubleClickElement(page, selector)`
Double click.

```typescript
await doubleClickElement(page, '.word');
```

### `rightClickElement(page, selector)`
Right click (context menu).

```typescript
await rightClickElement(page, '.file');
```

### `hoverOverElement(page, selector)`
Hover mouse over element.

```typescript
await hoverOverElement(page, '.tooltip-trigger');
```

### `dragAndDrop(page, sourceSelector, targetSelector)`
Drag and drop.

```typescript
await dragAndDrop(page, '#item1', '#dropzone');
```

---

## Scrolling

### `scrollElementIntoView(page, selector)`
Scroll element into view.

```typescript
await scrollElementIntoView(page, '#bottom-section');
```

### `scrollToTop(page)`
Scroll to top of page.

```typescript
await scrollToTop(page);
```

### `scrollToBottom(page)`
Scroll to bottom of page.

```typescript
await scrollToBottom(page);
```

### `scrollBy(page, x, y)`
Scroll by specific amount.

```typescript
await scrollBy(page, 0, 500); // Scroll down 500px
await scrollBy(page, 200, 0); // Scroll right 200px
```

---

## Screenshots

### `captureScreenshot(page, path)`
Take screenshot of viewport.

```typescript
await captureScreenshot(page, './screenshots/page.png');
```

### `takeScreenshot(page, fileName)`
Alternative screenshot method.

```typescript
await takeScreenshot(page, 'test-result.png');
```

### `takeFullPageScreenshot(page, path)`
Take full page screenshot.

```typescript
await takeFullPageScreenshot(page, './screenshots/full-page.png');
```

### `takeElementScreenshot(page, selector, path)`
Take screenshot of specific element.

```typescript
await takeElementScreenshot(page, '#chart', './screenshots/chart.png');
```

---

## Browser & Page Management

### `closePage(page)`
Close current page.

```typescript
await closePage(page);
```

### `openNewPage(page)`
Open new tab/page.

```typescript
const newPage = await openNewPage(page);
await navigateToUrl(newPage, 'https://example.com');
```

### `switchToTabOrWindowByIndex(page, index)`
Switch to tab by index.

```typescript
await switchToTabOrWindowByIndex(page, 1); // Switch to 2nd tab
```

### `getViewportSize(page)`
Get viewport dimensions.

```typescript
const size = getViewportSize(page);
console.log(`Viewport: ${size?.width}x${size?.height}`);
```

### `setViewportSize(page, width, height)`
Set viewport size.

```typescript
await setViewportSize(page, 1920, 1080);
```

---

## Storage

### Cookies

#### `getCookies(page)`
Get all cookies.

```typescript
const cookies = await getCookies(page);
console.log('Cookies:', cookies);
```

#### `addCookie(page, cookie)`
Add a cookie.

```typescript
await addCookie(page, {
  name: 'session_id',
  value: 'abc123',
  domain: 'example.com',
  path: '/',
  secure: true,
  httpOnly: true,
  sameSite: 'Strict',
});
```

#### `clearCookies(page)`
Clear all cookies.

```typescript
await clearCookies(page);
```

### LocalStorage

#### `getLocalStorageItem(page, key)`
Get localStorage item.

```typescript
const token = await getLocalStorageItem(page, 'authToken');
```

#### `setLocalStorageItem(page, key, value)`
Set localStorage item.

```typescript
await setLocalStorageItem(page, 'theme', 'dark');
```

#### `clearLocalStorage(page)`
Clear all localStorage.

```typescript
await clearLocalStorage(page);
```

### SessionStorage

#### `getSessionStorageItem(page, key)`
Get sessionStorage item.

```typescript
const data = await getSessionStorageItem(page, 'temp');
```

#### `setSessionStorageItem(page, key, value)`
Set sessionStorage item.

```typescript
await setSessionStorageItem(page, 'step', '2');
```

#### `clearSessionStorage(page)`
Clear all sessionStorage.

```typescript
await clearSessionStorage(page);
```

---

## Iframes & Frames

### `switchToIframe(page, selector)`
Get frame locator for iframe.

```typescript
const iframe = switchToIframe(page, '#my-iframe');
await iframe.locator('#button').click();
```

### `getAllFrames(page)`
Get all frames.

```typescript
const frames = getAllFrames(page);
console.log(`Page has ${frames.length} frames`);
```

---

## Dialogs & Alerts

### `handleDialog(page, action, promptText?)`
Handle JavaScript dialogs.

```typescript
// Accept alert/confirm
await handleDialog(page, 'accept');

// Dismiss alert/confirm
await handleDialog(page, 'dismiss');

// Accept prompt with text
await handleDialog(page, 'accept', 'My Input');
```

---

## File Operations

### `uploadFile(page, selector, filePath)`
Upload file(s).

```typescript
// Single file
await uploadFile(page, '#file-input', './files/document.pdf');

// Multiple files
await uploadFile(page, '#multi-file', ['./file1.pdf', './file2.pdf']);
```

### `clearFileInput(page, selector)`
Clear file input.

```typescript
await clearFileInput(page, '#file-input');
```

### `waitForDownload(page, triggerAction)`
Wait for download.

```typescript
const download = await waitForDownload(page, async () => {
  await clickElement(page, '#download-btn');
});

const path = await download.path();
console.log('Downloaded to:', path);
```

---

## Network Management

### `interceptRequest(page, urlPattern, handler)`
Intercept network requests.

```typescript
await interceptRequest(page, '**/api/**', async (route) => {
  console.log('Request:', route.request().url());
  await route.continue();
});
```

### `mockApiResponse(page, urlPattern, mockResponse)`
Mock API responses.

```typescript
await mockApiResponse(page, '**/api/users', {
  status: 200,
  body: { users: [{ id: 1, name: 'John' }] },
  headers: { 'Content-Type': 'application/json' },
});
```

### `waitForResponse(page, urlPattern)`
Wait for specific response.

```typescript
const response = await waitForResponse(page, '**/api/data');
console.log('Status:', response.status());
```

### `waitForRequest(page, urlPattern)`
Wait for specific request.

```typescript
const request = await waitForRequest(page, '**/api/submit');
console.log('Request made:', request.url());
```

---

## Advanced Features

### `waitForElement(page, selector, timeout?)`
Wait for element to appear.

```typescript
await waitForElement(page, '.loading-complete', 10000);
```

### `waitForElementToBeClickable(page, selector)`
Wait for element to be clickable.

```typescript
await waitForElementToBeClickable(page, '#submit-btn');
```

### `waitForNavigation(page, url)`
Wait for navigation to URL.

```typescript
await waitForNavigation(page, 'https://example.com/success');
```

### `waitForPageLoad(page, state?)`
Wait for page load state.

```typescript
await waitForPageLoad(page, 'networkidle');
```

### `wait(page, milliseconds)`
Wait for specific time.

```typescript
await wait(page, 2000); // Wait 2 seconds
```

### `waitForFunction(page, fn, options?)`
Wait for function to return true.

```typescript
await waitForFunction(
  page,
  () => document.querySelectorAll('.item').length > 5,
  { timeout: 5000 }
);
```

### `executeScript(page, script, ...args)`
Execute JavaScript.

```typescript
const result = await executeScript(page, () => {
  return document.title;
});

const sum = await executeScript(
  page,
  (a, b) => a + b,
  5,
  3
);
```

### `highlightElement(page, selector, duration?)`
Highlight element (debugging).

```typescript
await highlightElement(page, '#important-button', 3000);
```

### Accessibility Assertions

#### `verifyAccessibleName(locator, name)`
Verify accessible name.

```typescript
const button = page.locator('#submit');
await verifyAccessibleName(button, 'Submit Form');
```

#### `verifyAccessibleDescription(locator, description)`
Verify accessible description.

```typescript
const input = page.locator('#email');
await verifyAccessibleDescription(input, 'Enter your email address');
```

#### `verifyAccessibleRole(locator, role)`
Verify ARIA role.

```typescript
const nav = page.locator('nav');
await verifyAccessibleRole(nav, 'navigation');
```

---

## Complete Usage Examples

### Example 1: Login Flow

```typescript
test('Login flow', async ({ page }) => {
  await navigateToUrl(page, 'https://example.com/login');

  await fillInputField(page, '#email', 'user@example.com');
  await fillInputField(page, '#password', 'SecurePass123');
  await checkElement(page, '#remember-me');
  await clickElement(page, '#login-btn');

  await waitForNavigation(page, 'https://example.com/dashboard');

  const title = await getPageTitle(page);
  expect(title).toBe('Dashboard');
});
```

### Example 2: Form Validation

```typescript
test('Form validation', async ({ page }) => {
  await navigateToUrl(page, 'https://example.com/register');

  // Leave required field empty
  await clickElement(page, '#submit');

  const errorVisible = await isElementVisible(page, '.error-message');
  expect(errorVisible).toBeTruthy();

  const errorText = await getElementText(page, '.error-message');
  expect(errorText).toContain('required');
});
```

### Example 3: File Upload

```typescript
test('Upload files', async ({ page }) => {
  await navigateToUrl(page, 'https://example.com/upload');

  await uploadFile(page, '#file-input', './test-files/document.pdf');

  await clickElement(page, '#upload-btn');

  const response = await waitForResponse(page, '**/api/upload');
  expect(response.ok()).toBeTruthy();
});
```

### Example 4: Drag and Drop

```typescript
test('Drag and drop', async ({ page }) => {
  await navigateToUrl(page, 'https://example.com/kanban');

  await dragAndDrop(page, '#task-1', '#done-column');

  const taskLocation = await getElementAttributeValue(
    page,
    '#task-1',
    'data-column'
  );
  expect(taskLocation).toBe('done');
});
```

### Example 5: Working with Storage

```typescript
test('Manage storage', async ({ page }) => {
  await navigateToUrl(page, 'https://example.com');

  // Set localStorage
  await setLocalStorageItem(page, 'theme', 'dark');

  // Reload and check
  await reloadPage(page);

  const theme = await getLocalStorageItem(page, 'theme');
  expect(theme).toBe('dark');

  // Add cookie
  await addCookie(page, {
    name: 'preferences',
    value: 'compact-view',
  });

  const cookies = await getCookies(page);
  const prefCookie = cookies.find((c) => c.name === 'preferences');
  expect(prefCookie?.value).toBe('compact-view');
});
```

---

## Function Count Summary

**Total: 99+ Web Testing Functions**

- Navigation: 6 functions
- Element Interactions: 6 functions
- Element State Checks: 7 functions
- Element Information: 10 functions
- Forms & Inputs: 11 functions
- Keyboard Actions: 4 functions
- Mouse Actions: 5 functions
- Scrolling: 4 functions
- Screenshots: 4 functions
- Browser & Page: 5 functions
- Cookies: 3 functions
- LocalStorage: 3 functions
- SessionStorage: 3 functions
- Iframes: 2 functions
- Dialogs: 1 function
- Files: 3 functions
- Network: 4 functions
- Accessibility: 3 functions
- Advanced: 8 functions
- And more...

---

For more examples, see `src/tests/web-actions-examples.test.spec.ts`.
