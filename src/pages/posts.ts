import { Page } from "@playwright/test";
import * as faker from "@faker-js/faker";

/**
 * Adds a new post on the given page.
 * @param page - The Playwright Page object representing the web page.
 */
export const AddPost = async (page: Page) => {
  await page.click('text=/.*New Post.*/');
  await page.click('input[placeholder="Article Title"]');
  await page.fill('input[placeholder="Article Title"]', faker.faker.lorem.word());
  await page.click('input[placeholder="What\'s this article about?"]');
  await page.fill('input[placeholder="What\'s this article about?"]', 'Is it working');
  await page.click('textarea[placeholder="Write your article (in markdown)"]');
  await page.fill('textarea[placeholder="Write your article (in markdown)"]', 'I think so');
  await page.click('input[placeholder="Enter tags"]');
  await page.fill('input[placeholder="Enter tags"]', 'test');
  await Promise.all([
    page.click('text="Publish Article"')
  ]);
}