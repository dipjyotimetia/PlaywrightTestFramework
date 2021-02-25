const { addAttach } = require("jest-html-reporters/helper");

export const LoginPge = async () => {
    try {
        await page.goto("https://react-redux.realworld.io/");
        console.log("page title", await page.title());
        await page.click('[href="#login"]');
        await page.fill('input[type="email"]', 'testauto007@gmail.com');
        await page.fill('input[type="password"]', 'Password1');
        await page.click('button[type="submit"]')
        const screens = await page.screenshot()
        addAttach(screens, "test screen")
        await page.waitForNavigation()
        await page.waitForTimeout(8000)
    } catch (error) {
        const screen = await page.screenshot()
        addAttach(screen, "failed test screen")
        throw error
    }

}