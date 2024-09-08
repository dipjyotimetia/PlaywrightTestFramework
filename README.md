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

## API Testing with Playwright

This repository now includes support for testing REST APIs using Playwright. You can use the provided helper functions to perform HTTP requests and validate responses.

### Helper Functions

The following helper functions are available in `src/core/apiHelpers.ts`:

- `HttpPost`: Perform an HTTP POST request.
- `HttpGet`: Perform an HTTP GET request.
- `HttpPatch`: Perform an HTTP PATCH request.

### Sample API Tests

Sample API tests are available in `src/tests/api.test.spec.ts`. These tests demonstrate how to use the helper functions to test REST APIs.

### Running API Tests

To run the API tests, use the following command:

```bash
npx playwright test src/tests/api.test.spec.ts
```

## Code Formatting with Prettier

This repository uses Prettier for code formatting. To format the code, use the following command:

```bash
npm run format
```
