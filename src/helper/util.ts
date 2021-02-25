export const MockData = async () => {
    await page.route('**/api/articles?', async (route, request) => await route.fulfill({
        status: 400,
        path: 'mocks\feed.json'
    }));
}