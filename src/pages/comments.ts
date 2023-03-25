import { Page, TestInfo } from "@playwright/test";

export const AddComments = async (page: Page) => {
    await page.click('textarea[placeholder="Write a comment..."]');
    await page.fill('textarea[placeholder="Write a comment..."]', 'yea its working');
    await page.click('text="Post Comment"');
    await page.click('text="yea its working"');
    await page.click('text="yea its working"');
    await page.click('text="conduit"');
}