import { Page, ElementHandle } from '@playwright/test';

// Function to navigate to a URL
export async function navigateToUrl(page: Page, url: string): Promise<void> {
    await page.goto(url);
}

// Function to wait for an element to appear on the page
export async function waitForElement(page: Page, selector: string, timeout = 5000): Promise<void> {
    await page.waitForSelector(selector, { timeout });
}

// Function to click an element by its selector
export async function clickElement(page: Page, selector: string): Promise<void> {
    await page.click(selector);
}

// Function to fill an input field with text
export async function fillInputField(page: Page, selector: string, text: string): Promise<void> {
    await page.fill(selector, text);
}

// Function to capture a screenshot
export async function captureScreenshot(page: Page, path: string): Promise<void> {
    await page.screenshot({ path });
}

// Function to get the text content of an element
export async function getElementText(page: Page, selector: string): Promise<string | null> {
    const element = await page.$(selector);
    if (!element) {
        throw new Error(`Element with selector ${selector} not found.`);
    }
    return element.textContent();
}

// Function to wait for navigation to complete
export async function waitForNavigation(page: Page, url: string): Promise<void> {
    await page.waitForURL(url);
}

// Function to check if an element exists on the page
export async function doesElementExist(page: Page, selector: string): Promise<boolean> {
    const element = await page.$(selector);
    return !!element;
}

// Function to clear the content of an input field
export async function clearInputField(page: Page, selector: string): Promise<void> {
    await page.fill(selector, ''); // Fill with an empty string to clear the field
}

// Function to select an option from a dropdown by value
export async function selectDropdownOptionByValue(page: Page, selector: string, value: string): Promise<void> {
    await page.selectOption(selector, { value });
}

// Function to hover over an element
export async function hoverOverElement(page: Page, selector: string): Promise<void> {
    await page.hover(selector);
}

// Function to right-click an element
export async function rightClickElement(page: Page, selector: string): Promise<void> {
    await page.click(selector, { button: 'right' });
}

// Function to get an attribute's value of an element
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

// Function to retrieve an array of elements by selector
export async function getElements(page: Page, selector: string): Promise<ElementHandle[]> {
    return await page.locator(selector).elementHandles();
}

// Function to switch to a new tab or window by index
export async function switchToTabOrWindowByIndex(page: Page, index: number): Promise<void> {
    const pages = await page.context().pages();
    if (index >= 0 && index < pages.length) {
        await pages[index].bringToFront();
    } else {
        throw new Error(`Tab or window with index ${index} not found.`);
    }
}

// Function to click an element and wait for a navigation event
export async function clickAndWaitForNavigation(page: Page, selector: string): Promise<void> {
    await Promise.all([
        page.click(selector),
        page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    ]);
}

// Function to scroll an element into view
export async function scrollElementIntoView(page: Page, selector: string): Promise<void> {
    const element = await page.$(selector);
    if (element) {
        await element.scrollIntoViewIfNeeded();
    }
}

// Function to take a screenshot of the current page
export async function takeScreenshot(page: Page, fileName: string): Promise<void> {
    await page.screenshot({ path: fileName });
}

// Function to wait for an element to be visible and clickable
export async function waitForElementToBeClickable(page: Page, selector: string): Promise<ElementHandle | null> {
    return page.waitForSelector(selector, { state: 'visible' });
}

// Function to type text into an input field
export async function typeText(page: Page, selector: string, text: string): Promise<void> {
    await page.type(selector, text);
}

// Function to press the Enter key
export async function pressEnter(page: Page, selector: string): Promise<void> {
    await page.press(selector, 'Enter');
}

// Function to press the Tab key
export async function pressTab(page: Page, selector: string): Promise<void> {
    await page.press(selector, 'Tab');
}
