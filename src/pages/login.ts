import  { Page } from "@playwright/test";

export const LoginPge = async (page: Page) => {
    try {
        await page.goto("https://react-redux.realworld.io/");
        console.log("page title", await page.title());
        await page.click('[href="#login"]');
        await page.fill('input[type="email"]', 'testauto@gmail.com');
        await page.fill('input[type="password"]', 'Password1');
        await page.click('button[type="submit"]')
        await page.screenshot({ path: 'screenshot.png', fullPage: true });
        await page.waitForTimeout(8000)
    } catch (error) {
        await page.screenshot({ path: 'screenshot.png', fullPage: true });
        throw error
    }

}