import { Page } from "@playwright/test";
import { TestInfo } from "@playwright/test/types/test";

export const LoginPge = async (page: Page, testInfo: TestInfo) => {
    try {
        await page.goto("https://react-redux.realworld.io/");
        console.log("page title", await page.title());
        await page.click('[href="#login"]');
        await page.fill('input[type="email"]', 'testauto@gmail.com');
        await page.fill('input[type="password"]', 'Password1');
        await page.click('button[type="submit"]')
        await testInfo.attach("basic-page-screen", {
            body: await page.screenshot(),
            contentType: "image/png",
        });
        await page.waitForTimeout(8000)
    } catch (error) {
        await page.screenshot({ path: 'screenshot.png', fullPage: true });
        throw error
    }

}