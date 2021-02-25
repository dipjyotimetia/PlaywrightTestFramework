export const AddComments = async () => {
    await page.click('textarea[placeholder="Write a comment..."]');
    await page.fill('textarea[placeholder="Write a comment..."]', 'yea its working');
    await page.click('text="Post Comment"');
    await page.click('text="yea its working"');
    await page.click('text="yea its working"');
    await page.click('text="conduit"');
}