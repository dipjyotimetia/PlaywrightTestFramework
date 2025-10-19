import { Page, ElementHandle, Locator, expect } from '@playwright/test';

export async function navigateToUrl(page: Page, url: string): Promise<void> {
  await page.goto(url);
}

export async function waitForElement(
  page: Page,
  selector: string,
  timeout = 5000
): Promise<void> {
  await page.waitForSelector(selector, { timeout });
}

export async function clickElement(
  page: Page,
  selector: string
): Promise<void> {
  await page.click(selector);
}

export async function fillInputField(
  page: Page,
  selector: string,
  text: string
): Promise<void> {
  await page.fill(selector, text);
}

export async function captureScreenshot(
  page: Page,
  path: string
): Promise<void> {
  await page.screenshot({ path });
}

export async function getElementText(
  page: Page,
  selector: string
): Promise<string | null> {
  const element = await page.$(selector);
  if (!element) {
    throw new Error(`Element with selector ${selector} not found.`);
  }
  return element.textContent();
}

export async function waitForNavigation(
  page: Page,
  url: string
): Promise<void> {
  await page.waitForURL(url);
}

export async function doesElementExist(
  page: Page,
  selector: string
): Promise<boolean> {
  const element = await page.$(selector);
  return !!element;
}

export async function clearInputField(
  page: Page,
  selector: string
): Promise<void> {
  await page.fill(selector, '');
}

export async function selectDropdownOptionByValue(
  page: Page,
  selector: string,
  value: string
): Promise<void> {
  await page.selectOption(selector, { value });
}

export async function hoverOverElement(
  page: Page,
  selector: string
): Promise<void> {
  await page.hover(selector);
}

export async function rightClickElement(
  page: Page,
  selector: string
): Promise<void> {
  await page.click(selector, { button: 'right' });
}

export async function getElementAttributeValue(
  page: Page,
  selector: string,
  attributeName: string
): Promise<string | null> {
  const element = await page.$(selector);
  if (!element) {
    throw new Error(`Element with selector ${selector} not found.`);
  }
  return element.getAttribute(attributeName);
}

export async function getElements(
  page: Page,
  selector: string
): Promise<ElementHandle[]> {
  return await page.locator(selector).elementHandles();
}

export async function switchToTabOrWindowByIndex(
  page: Page,
  index: number
): Promise<void> {
  const pages = await page.context().pages();
  if (index >= 0 && index < pages.length) {
    await pages[index].bringToFront();
  } else {
    throw new Error(`Tab or window with index ${index} not found.`);
  }
}

export async function clickAndWaitForNavigation(
  page: Page,
  selector: string
): Promise<void> {
  await Promise.all([
    page.click(selector),
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
  ]);
}

export async function scrollElementIntoView(
  page: Page,
  selector: string
): Promise<void> {
  const element = await page.$(selector);
  if (element) {
    await element.scrollIntoViewIfNeeded();
  }
}

export async function takeScreenshot(
  page: Page,
  fileName: string
): Promise<void> {
  await page.screenshot({ path: fileName });
}

export async function waitForElementToBeClickable(
  page: Page,
  selector: string
): Promise<ElementHandle | null> {
  return page.waitForSelector(selector, { state: 'visible' });
}

export async function typeText(
  page: Page,
  selector: string,
  text: string
): Promise<void> {
  await page.type(selector, text);
}

export async function pressEnter(page: Page, selector: string): Promise<void> {
  await page.press(selector, 'Enter');
}

export async function pressTab(page: Page, selector: string): Promise<void> {
  await page.press(selector, 'Tab');
}

export async function selectDropdownOption(
  page: Page,
  selector: string,
  option: string | { label?: string; value?: string; index?: number }
): Promise<void> {
  await page.selectOption(selector, option);
}

/**
 * Verifies that an element has the specified accessible description.
 * Uses Playwright v1.46+ accessibility assertion.
 * @param locator - The Playwright locator for the element
 * @param description - The expected accessible description
 */
export async function verifyAccessibleDescription(
  locator: Locator,
  description: string | RegExp
): Promise<void> {
  await expect(locator).toHaveAccessibleDescription(description);
}

/**
 * Verifies that an element has the specified ARIA role.
 * Uses Playwright v1.46+ accessibility assertion.
 * @param locator - The Playwright locator for the element
 * @param role - The expected ARIA role (e.g., 'button', 'navigation', 'link')
 */
export async function verifyAccessibleRole(
  locator: Locator,
  role:
    | 'alert'
    | 'alertdialog'
    | 'application'
    | 'article'
    | 'banner'
    | 'blockquote'
    | 'button'
    | 'caption'
    | 'cell'
    | 'checkbox'
    | 'code'
    | 'columnheader'
    | 'combobox'
    | 'complementary'
    | 'contentinfo'
    | 'definition'
    | 'deletion'
    | 'dialog'
    | 'directory'
    | 'document'
    | 'emphasis'
    | 'feed'
    | 'figure'
    | 'form'
    | 'generic'
    | 'grid'
    | 'gridcell'
    | 'group'
    | 'heading'
    | 'img'
    | 'insertion'
    | 'link'
    | 'list'
    | 'listbox'
    | 'listitem'
    | 'log'
    | 'main'
    | 'marquee'
    | 'math'
    | 'meter'
    | 'menu'
    | 'menubar'
    | 'menuitem'
    | 'menuitemcheckbox'
    | 'menuitemradio'
    | 'navigation'
    | 'none'
    | 'note'
    | 'option'
    | 'paragraph'
    | 'presentation'
    | 'progressbar'
    | 'radio'
    | 'radiogroup'
    | 'region'
    | 'row'
    | 'rowgroup'
    | 'rowheader'
    | 'scrollbar'
    | 'search'
    | 'searchbox'
    | 'separator'
    | 'slider'
    | 'spinbutton'
    | 'status'
    | 'strong'
    | 'subscript'
    | 'superscript'
    | 'switch'
    | 'tab'
    | 'table'
    | 'tablist'
    | 'tabpanel'
    | 'term'
    | 'textbox'
    | 'time'
    | 'timer'
    | 'toolbar'
    | 'tooltip'
    | 'tree'
    | 'treegrid'
    | 'treeitem'
): Promise<void> {
  await expect(locator).toHaveRole(role);
}

/**
 * Verifies that an element has the specified accessible name.
 * @param locator - The Playwright locator for the element
 * @param name - The expected accessible name
 */
export async function verifyAccessibleName(
  locator: Locator,
  name: string | RegExp
): Promise<void> {
  await expect(locator).toHaveAccessibleName(name);
}

// ============================================
// ENHANCED WEB ACTIONS - Additional Functions
// ============================================

/**
 * Double clicks on an element
 * @param page - Playwright page object
 * @param selector - Element selector
 */
export async function doubleClickElement(
  page: Page,
  selector: string
): Promise<void> {
  await page.dblclick(selector);
}

/**
 * Checks a checkbox or radio button
 * @param page - Playwright page object
 * @param selector - Element selector
 */
export async function checkElement(
  page: Page,
  selector: string
): Promise<void> {
  await page.check(selector);
}

/**
 * Unchecks a checkbox
 * @param page - Playwright page object
 * @param selector - Element selector
 */
export async function uncheckElement(
  page: Page,
  selector: string
): Promise<void> {
  await page.uncheck(selector);
}

/**
 * Checks if an element is checked
 * @param page - Playwright page object
 * @param selector - Element selector
 * @returns True if checked, false otherwise
 */
export async function isElementChecked(
  page: Page,
  selector: string
): Promise<boolean> {
  return await page.isChecked(selector);
}

/**
 * Checks if an element is visible
 * @param page - Playwright page object
 * @param selector - Element selector
 * @returns True if visible, false otherwise
 */
export async function isElementVisible(
  page: Page,
  selector: string
): Promise<boolean> {
  return await page.isVisible(selector);
}

/**
 * Checks if an element is hidden
 * @param page - Playwright page object
 * @param selector - Element selector
 * @returns True if hidden, false otherwise
 */
export async function isElementHidden(
  page: Page,
  selector: string
): Promise<boolean> {
  return await page.isHidden(selector);
}

/**
 * Checks if an element is enabled
 * @param page - Playwright page object
 * @param selector - Element selector
 * @returns True if enabled, false otherwise
 */
export async function isElementEnabled(
  page: Page,
  selector: string
): Promise<boolean> {
  return await page.isEnabled(selector);
}

/**
 * Checks if an element is disabled
 * @param page - Playwright page object
 * @param selector - Element selector
 * @returns True if disabled, false otherwise
 */
export async function isElementDisabled(
  page: Page,
  selector: string
): Promise<boolean> {
  return await page.isDisabled(selector);
}

/**
 * Checks if an element is editable
 * @param page - Playwright page object
 * @param selector - Element selector
 * @returns True if editable, false otherwise
 */
export async function isElementEditable(
  page: Page,
  selector: string
): Promise<boolean> {
  return await page.isEditable(selector);
}

/**
 * Gets the count of elements matching selector
 * @param page - Playwright page object
 * @param selector - Element selector
 * @returns Count of elements
 */
export async function getElementCount(
  page: Page,
  selector: string
): Promise<number> {
  return await page.locator(selector).count();
}

/**
 * Gets the inner HTML of an element
 * @param page - Playwright page object
 * @param selector - Element selector
 * @returns Inner HTML as string
 */
export async function getInnerHTML(
  page: Page,
  selector: string
): Promise<string> {
  return await page.innerHTML(selector);
}

/**
 * Gets the inner text of an element
 * @param page - Playwright page object
 * @param selector - Element selector
 * @returns Inner text as string
 */
export async function getInnerText(
  page: Page,
  selector: string
): Promise<string> {
  return await page.innerText(selector);
}

/**
 * Gets the input value of an element
 * @param page - Playwright page object
 * @param selector - Element selector
 * @returns Input value as string
 */
export async function getInputValue(
  page: Page,
  selector: string
): Promise<string> {
  return await page.inputValue(selector);
}

/**
 * Gets all text content from elements matching selector
 * @param page - Playwright page object
 * @param selector - Element selector
 * @returns Array of text content
 */
export async function getAllTextContent(
  page: Page,
  selector: string
): Promise<string[]> {
  return await page.locator(selector).allTextContents();
}

/**
 * Focuses on an element
 * @param page - Playwright page object
 * @param selector - Element selector
 */
export async function focusElement(
  page: Page,
  selector: string
): Promise<void> {
  await page.focus(selector);
}

/**
 * Blurs (removes focus from) an element
 * @param page - Playwright page object
 * @param selector - Element selector
 */
export async function blurElement(
  page: Page,
  selector: string
): Promise<void> {
  await page.evaluate((sel) => {
    const element = document.querySelector(sel) as HTMLElement;
    if (element) element.blur();
  }, selector);
}

/**
 * Drags and drops from source to target element
 * @param page - Playwright page object
 * @param sourceSelector - Source element selector
 * @param targetSelector - Target element selector
 */
export async function dragAndDrop(
  page: Page,
  sourceSelector: string,
  targetSelector: string
): Promise<void> {
  await page.dragAndDrop(sourceSelector, targetSelector);
}

/**
 * Selects text in an input field
 * @param page - Playwright page object
 * @param selector - Element selector
 */
export async function selectText(
  page: Page,
  selector: string
): Promise<void> {
  await page.locator(selector).selectText();
}

/**
 * Press a specific key or key combination
 * @param page - Playwright page object
 * @param selector - Element selector
 * @param key - Key to press (e.g., 'Enter', 'Escape', 'Control+A')
 */
export async function pressKey(
  page: Page,
  selector: string,
  key: string
): Promise<void> {
  await page.press(selector, key);
}

/**
 * Press multiple keys in sequence
 * @param page - Playwright page object
 * @param selector - Element selector
 * @param keys - Array of keys to press
 */
export async function pressKeys(
  page: Page,
  selector: string,
  keys: string[]
): Promise<void> {
  for (const key of keys) {
    await page.press(selector, key);
  }
}

/**
 * Reloads the current page
 * @param page - Playwright page object
 * @param options - Reload options
 */
export async function reloadPage(
  page: Page,
  options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }
): Promise<void> {
  await page.reload(options);
}

/**
 * Goes back in browser history
 * @param page - Playwright page object
 */
export async function goBack(page: Page): Promise<void> {
  await page.goBack();
}

/**
 * Goes forward in browser history
 * @param page - Playwright page object
 */
export async function goForward(page: Page): Promise<void> {
  await page.goForward();
}

/**
 * Gets current page URL
 * @param page - Playwright page object
 * @returns Current URL
 */
export function getCurrentUrl(page: Page): string {
  return page.url();
}

/**
 * Gets page title
 * @param page - Playwright page object
 * @returns Page title
 */
export async function getPageTitle(page: Page): Promise<string> {
  return await page.title();
}

/**
 * Waits for a specific amount of time
 * @param page - Playwright page object
 * @param milliseconds - Time to wait in milliseconds
 */
export async function wait(page: Page, milliseconds: number): Promise<void> {
  await page.waitForTimeout(milliseconds);
}

/**
 * Waits for page to load completely
 * @param page - Playwright page object
 * @param state - Load state to wait for
 */
export async function waitForPageLoad(
  page: Page,
  state: 'load' | 'domcontentloaded' | 'networkidle' = 'load'
): Promise<void> {
  await page.waitForLoadState(state);
}

/**
 * Waits for a function to return truthy value
 * @param page - Playwright page object
 * @param fn - Function to evaluate
 * @param options - Wait options
 */
export async function waitForFunction(
  page: Page,
  fn: () => boolean | Promise<boolean>,
  options?: { timeout?: number; polling?: number | 'raf' }
): Promise<void> {
  await page.waitForFunction(fn, options);
}

/**
 * Executes JavaScript in the page context
 * @param page - Playwright page object
 * @param script - JavaScript to execute
 * @param args - Arguments to pass to the script
 * @returns Result of the script execution
 */
export async function executeScript<T = any>(
  page: Page,
  script: string | ((...args: any[]) => T),
  ...args: any[]
): Promise<T> {
  return await page.evaluate(script, ...args);
}

/**
 * Gets bounding box of an element
 * @param page - Playwright page object
 * @param selector - Element selector
 * @returns Bounding box coordinates
 */
export async function getElementBoundingBox(
  page: Page,
  selector: string
): Promise<{ x: number; y: number; width: number; height: number } | null> {
  const element = await page.$(selector);
  if (!element) return null;
  return await element.boundingBox();
}

/**
 * Takes a full page screenshot
 * @param page - Playwright page object
 * @param path - File path to save screenshot
 */
export async function takeFullPageScreenshot(
  page: Page,
  path: string
): Promise<void> {
  await page.screenshot({ path, fullPage: true });
}

/**
 * Takes a screenshot of a specific element
 * @param page - Playwright page object
 * @param selector - Element selector
 * @param path - File path to save screenshot
 */
export async function takeElementScreenshot(
  page: Page,
  selector: string,
  path: string
): Promise<void> {
  const element = await page.$(selector);
  if (element) {
    await element.screenshot({ path });
  }
}

/**
 * Scrolls to top of page
 * @param page - Playwright page object
 */
export async function scrollToTop(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, 0));
}

/**
 * Scrolls to bottom of page
 * @param page - Playwright page object
 */
export async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}

/**
 * Scrolls by a specific amount
 * @param page - Playwright page object
 * @param x - Horizontal scroll amount
 * @param y - Vertical scroll amount
 */
export async function scrollBy(
  page: Page,
  x: number,
  y: number
): Promise<void> {
  await page.evaluate(
    ({ x, y }) => window.scrollBy(x, y),
    { x, y }
  );
}

/**
 * Gets all cookies
 * @param page - Playwright page object
 * @returns Array of cookies
 */
export async function getCookies(page: Page) {
  return await page.context().cookies();
}

/**
 * Adds a cookie
 * @param page - Playwright page object
 * @param cookie - Cookie to add
 */
export async function addCookie(
  page: Page,
  cookie: {
    name: string;
    value: string;
    url?: string;
    domain?: string;
    path?: string;
    expires?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
  }
): Promise<void> {
  await page.context().addCookies([cookie]);
}

/**
 * Clears all cookies
 * @param page - Playwright page object
 */
export async function clearCookies(page: Page): Promise<void> {
  await page.context().clearCookies();
}

/**
 * Gets local storage item
 * @param page - Playwright page object
 * @param key - Storage key
 * @returns Storage value
 */
export async function getLocalStorageItem(
  page: Page,
  key: string
): Promise<string | null> {
  return await page.evaluate((k) => localStorage.getItem(k), key);
}

/**
 * Sets local storage item
 * @param page - Playwright page object
 * @param key - Storage key
 * @param value - Storage value
 */
export async function setLocalStorageItem(
  page: Page,
  key: string,
  value: string
): Promise<void> {
  await page.evaluate(
    ({ key, value }) => localStorage.setItem(key, value),
    { key, value }
  );
}

/**
 * Clears local storage
 * @param page - Playwright page object
 */
export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear());
}

/**
 * Gets session storage item
 * @param page - Playwright page object
 * @param key - Storage key
 * @returns Storage value
 */
export async function getSessionStorageItem(
  page: Page,
  key: string
): Promise<string | null> {
  return await page.evaluate((k) => sessionStorage.getItem(k), key);
}

/**
 * Sets session storage item
 * @param page - Playwright page object
 * @param key - Storage key
 * @param value - Storage value
 */
export async function setSessionStorageItem(
  page: Page,
  key: string,
  value: string
): Promise<void> {
  await page.evaluate(
    ({ key, value }) => sessionStorage.setItem(key, value),
    { key, value }
  );
}

/**
 * Clears session storage
 * @param page - Playwright page object
 */
export async function clearSessionStorage(page: Page): Promise<void> {
  await page.evaluate(() => sessionStorage.clear());
}

/**
 * Uploads a file to file input
 * @param page - Playwright page object
 * @param selector - File input selector
 * @param filePath - Path to file to upload
 */
export async function uploadFile(
  page: Page,
  selector: string,
  filePath: string | string[]
): Promise<void> {
  await page.setInputFiles(selector, filePath);
}

/**
 * Clears uploaded files from file input
 * @param page - Playwright page object
 * @param selector - File input selector
 */
export async function clearFileInput(
  page: Page,
  selector: string
): Promise<void> {
  await page.setInputFiles(selector, []);
}

/**
 * Gets viewport size
 * @param page - Playwright page object
 * @returns Viewport dimensions
 */
export function getViewportSize(page: Page): { width: number; height: number } | null {
  return page.viewportSize();
}

/**
 * Sets viewport size
 * @param page - Playwright page object
 * @param width - Viewport width
 * @param height - Viewport height
 */
export async function setViewportSize(
  page: Page,
  width: number,
  height: number
): Promise<void> {
  await page.setViewportSize({ width, height });
}

/**
 * Closes the current page
 * @param page - Playwright page object
 */
export async function closePage(page: Page): Promise<void> {
  await page.close();
}

/**
 * Opens a new page/tab
 * @param page - Playwright page object
 * @returns New page object
 */
export async function openNewPage(page: Page): Promise<Page> {
  return await page.context().newPage();
}

/**
 * Switches to iframe by selector
 * @param page - Playwright page object
 * @param selector - Iframe selector
 * @returns Frame locator
 */
export function switchToIframe(page: Page, selector: string) {
  return page.frameLocator(selector);
}

/**
 * Gets all frames
 * @param page - Playwright page object
 * @returns Array of frames
 */
export function getAllFrames(page: Page) {
  return page.frames();
}

/**
 * Handles dialog (alert, confirm, prompt)
 * @param page - Playwright page object
 * @param action - Action to perform (accept/dismiss)
 * @param promptText - Text to enter for prompt dialogs
 */
export async function handleDialog(
  page: Page,
  action: 'accept' | 'dismiss',
  promptText?: string
): Promise<void> {
  page.once('dialog', async (dialog) => {
    if (action === 'accept') {
      await dialog.accept(promptText);
    } else {
      await dialog.dismiss();
    }
  });
}

/**
 * Waits for a download to start and returns download object
 * @param page - Playwright page object
 * @param triggerAction - Action that triggers the download
 * @returns Download object
 */
export async function waitForDownload(
  page: Page,
  triggerAction: () => Promise<void>
) {
  const downloadPromise = page.waitForEvent('download');
  await triggerAction();
  return await downloadPromise;
}

/**
 * Intercepts network requests matching URL pattern
 * @param page - Playwright page object
 * @param urlPattern - URL pattern to match
 * @param handler - Function to handle the request
 */
export async function interceptRequest(
  page: Page,
  urlPattern: string | RegExp,
  handler: (route: any) => Promise<void>
): Promise<void> {
  await page.route(urlPattern, handler);
}

/**
 * Mocks API response
 * @param page - Playwright page object
 * @param urlPattern - URL pattern to match
 * @param mockResponse - Mock response data
 */
export async function mockApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  mockResponse: {
    status?: number;
    body?: any;
    headers?: Record<string, string>;
  }
): Promise<void> {
  await page.route(urlPattern, async (route) => {
    await route.fulfill({
      status: mockResponse.status || 200,
      body: JSON.stringify(mockResponse.body),
      headers: mockResponse.headers,
    });
  });
}

/**
 * Waits for network response matching URL pattern
 * @param page - Playwright page object
 * @param urlPattern - URL pattern to match
 * @returns Response object
 */
export async function waitForResponse(
  page: Page,
  urlPattern: string | RegExp
) {
  return await page.waitForResponse(urlPattern);
}

/**
 * Waits for network request matching URL pattern
 * @param page - Playwright page object
 * @param urlPattern - URL pattern to match
 * @returns Request object
 */
export async function waitForRequest(
  page: Page,
  urlPattern: string | RegExp
) {
  return await page.waitForRequest(urlPattern);
}

/**
 * Gets CSS property value of an element
 * @param page - Playwright page object
 * @param selector - Element selector
 * @param property - CSS property name
 * @returns CSS property value
 */
export async function getCSSProperty(
  page: Page,
  selector: string,
  property: string
): Promise<string> {
  return await page.locator(selector).evaluate(
    (element, prop) => window.getComputedStyle(element).getPropertyValue(prop),
    property
  );
}

/**
 * Highlights an element (for debugging)
 * @param page - Playwright page object
 * @param selector - Element selector
 * @param duration - Duration to highlight in milliseconds
 */
export async function highlightElement(
  page: Page,
  selector: string,
  duration: number = 2000
): Promise<void> {
  await page.locator(selector).evaluate((element, ms) => {
    const original = (element as HTMLElement).style.outline;
    (element as HTMLElement).style.outline = '3px solid red';
    setTimeout(() => {
      (element as HTMLElement).style.outline = original;
    }, ms);
  }, duration);
}
