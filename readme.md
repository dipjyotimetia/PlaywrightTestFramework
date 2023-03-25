# 🎭 Playwright | AutomationTest | UI Framework

## Tech Details

- Playwright - Playwright is a cross-browser automation library for Node.js. It enables you to write reliable end-to-end tests for web applications and websites. With Playwright, you can automate scenarios across multiple browsers (Chromium, Firefox, WebKit) and platforms (Windows, Linux, macOS).
- Allure - Allure is a flexible lightweight multi-language test report tool that not only shows a very concise representation of what have been tested in a neat web report form, but allows everyone participating in the development process to extract maximum of useful information from everyday execution of tests.


[Playwright](https://playwright.dev/)

[Axios](https://axios-http.com/)

This patch allows passing 0 to disable timeout for the following methods:

```typescript
await page.goto(`http://www.goole.com.au`, { timeout: 0 });
await page.waitForSelector(`a[href='/signup']`, { visible: true });
```

- page.goto
- page.waitForNavigation
- page.goForward
- page.goBack

### Docker container run

```bash
docker-compose up
```