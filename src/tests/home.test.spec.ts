import { test } from '@playwright/test';
import { allure } from 'allure-playwright';

import { LoginPage } from '../pages/login';
import { AddPost } from '../pages/posts';
import { AddComments } from '../pages/comments';

test.describe('Test Suite', () => {
  // All tests in this describe group will get 2 retry attempts.
  test.describe.configure({ retries: 2, mode: 'serial' });
  test('Home page should have the correct title', async ({
    page,
  }, testInfo) => {
    await allure.link('https://playwright.dev', 'playwright-site'); // link with name
    await allure.issue(
      'Issue Name',
      'https://github.com/allure-framework/allure-js/issues/352'
    );
    await LoginPage(page, testInfo);
    await AddPost(page);
    await AddComments(page, testInfo);
  });
});
