import { Page, TestInfo } from "@playwright/test";

/**
 * Adds comments to a webpage using Playwright's API.
 * @param page - The Playwright `Page` object representing the webpage.
 */
export const AddComments = async (page: Page, testInfo: TestInfo) => {
  const commentTextarea = 'textarea[placeholder="Write your article (in markdown)"]';
  const postCommentButton = '//button[text()="Publish Article"]';
  const conduitLink = '//a[text()="conduit"]';

  await page.click(commentTextarea);
  await page.fill(commentTextarea, 'yea its working');
  await page.click(postCommentButton);
  await page.click(conduitLink);
  await testInfo.attach("AddCommentsScreenshot", {
    body: await page.screenshot(),
    contentType: "image/png",
  });
}