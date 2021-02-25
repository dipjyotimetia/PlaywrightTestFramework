export const AddPost = async () => {
  await page.click('text=/.*New Post.*/');
  await page.click('input[placeholder="Article Title"]');
  await page.fill('input[placeholder="Article Title"]', 'NewTest');
  await page.click('input[placeholder="What\'s this article about?"]');
  await page.fill('input[placeholder="What\'s this article about?"]', 'Is it working');
  await page.click('textarea[placeholder="Write your article (in markdown)"]');
  await page.fill('textarea[placeholder="Write your article (in markdown)"]', 'I think so');
  await page.click('input[placeholder="Enter tags"]');
  await page.fill('input[placeholder="Enter tags"]', 'test');
  await Promise.all([
    page.waitForNavigation(/*{ url: 'https://react-redux.realworld.io/#/article/newtest-7a0n2w?_k=8nji14' }*/),
    page.click('text="Publish Article"')
  ]);
}