# Playwright | AutomationTest | UI Framework

## Tech Details

- Jest - Simple lightweight test runner that supports concurrency. https://facebook.github.io/jest/

- Playwright - A Node library which provides a high-level API to control headless Chrome or Chromium over the DevTools Protocol. It can also be configured to use full (non-headless) Chrome or Chromium.


[Jest](https://github.com/facebook/jest/blob/master/README.md)

[Playwright](https://github.com/microsoft/playwright/blob/master/README.md)

[Axios](https://github.com/axios/axios/blob/master/README.md)

This patch allows passing 0 to disable timeout for the following methods:

```javascript
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