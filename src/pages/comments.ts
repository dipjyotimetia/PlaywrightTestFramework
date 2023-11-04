import { Page, TestInfo } from "@playwright/test";

/**
 * Adds comments to a webpage using Playwright's API.
 * @param page - The Playwright `Page` object representing the webpage.
 */
export const AddComments = async (page: Page) => {
  const commentTextarea = 'textarea[placeholder="Write a comment..."]';
  const postCommentButton = 'text="Post Comment"';
  const commentText = 'text="yea its working"';
  const conduitLink = 'text="conduit"';

  await page.click(commentTextarea);
  await page.fill(commentTextarea, 'yea its working');
  await page.click(postCommentButton);
  await page.click(commentText);
  await page.click(commentText);
  await page.click(conduitLink);
}