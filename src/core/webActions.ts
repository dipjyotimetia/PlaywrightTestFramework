import { Page, ElementHandle } from '@playwright/test';

/**
 * Navigates to a specified URL in a web page using the Playwright library.
 * @param page - An instance of the `Page` class from the Playwright library.
 * @param url - A string representing the URL to navigate to.
 */
export async function navigateToUrl(page: Page, url: string): Promise<void> {
  await page.goto(url);
}

export async function waitForElement(page: Page, selector: string, timeout = 5000): Promise<void> {
    await page.waitForSelector(selector, { timeout });
}

export async function clickElement(page: Page, selector: string): Promise<void> {
    await page.click(selector);
}

export async function fillInputField(page: Page, selector: string, text: string): Promise<void> {
    await page.fill(selector, text);
}

export async function captureScreenshot(page: Page, path: string): Promise<void> {
    await page.screenshot({ path });
}

export async function getElementText(page: Page, selector: string): Promise<string | null> {
    const element = await page.$(selector);
    if (!element) {
        throw new Error(`Element with selector ${selector} not found.`);
    }
    return element.textContent();
}

export async function waitForNavigation(page: Page, url: string): Promise<void> {
    await page.waitForURL(url);
}

export async function doesElementExist(page: Page, selector: string): Promise<boolean> {
    const element = await page.$(selector);
    return !!element;
}

export async function clearInputField(page: Page, selector: string): Promise<void> {
    await page.fill(selector, '');
}

export async function selectDropdownOptionByValue(page: Page, selector: string, value: string): Promise<void> {
    await page.selectOption(selector, { value });
}

export async function hoverOverElement(page: Page, selector: string): Promise<void> {
    await page.hover(selector);
}

export async function rightClickElement(page: Page, selector: string): Promise<void> {
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

export async function getElements(page: Page, selector: string): Promise<ElementHandle[]> {
    return await page.locator(selector).elementHandles();
}

export async function switchToTabOrWindowByIndex(page: Page, index: number): Promise<void> {
    const pages = await page.context().pages();
    if (index >= 0 && index < pages.length) {
        await pages[index].bringToFront();
    } else {
        throw new Error(`Tab or window with index ${index} not found.`);
    }
}

export async function clickAndWaitForNavigation(page: Page, selector: string): Promise<void> {
    await Promise.all([
        page.click(selector),
        page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    ]);
}

export async function scrollElementIntoView(page: Page, selector: string): Promise<void> {
    const element = await page.$(selector);
    if (element) {
        await element.scrollIntoViewIfNeeded();
    }
}

export async function takeScreenshot(page: Page, fileName: string): Promise<void> {
    await page.screenshot({ path: fileName });
}

export async function waitForElementToBeClickable(page: Page, selector: string): Promise<ElementHandle | null> {
    return page.waitForSelector(selector, { state: 'visible' });
}

export async function typeText(page: Page, selector: string, text: string): Promise<void> {
    await page.type(selector, text);
}

export async function pressEnter(page: Page, selector: string): Promise<void> {
    await page.press(selector, 'Enter');
}

export async function pressTab(page: Page, selector: string): Promise<void> {
    await page.press(selector, 'Tab');
}
