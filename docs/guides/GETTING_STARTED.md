# Getting Started with Playwright Test Framework

## Quick Start Guide

### Prerequisites

- **Node.js** >= 20.x
- **pnpm** >= 9.x
- **Git**
- **Docker** (optional, for containerized execution)

### Installation

1. **Clone the repository:**
```bash
git clone git@github.com:dipjyotimetia/PlaywrightTestFramework.git
cd PlaywrightTestFramework
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Install Playwright browsers:**
```bash
npx playwright install
```

4. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Running Your First Test

```bash
# Run all tests
npx playwright test

# Run tests in headed mode
npm run test:playwright

# Run specific test file
npx playwright test src/tests/e2e/auth/login.test.ts

# Run tests in specific browser
npx playwright test --project=chromium
```

### Project Structure Overview

```
PlaywrightTestFramework/
├── docs/              # Documentation
├── config/            # All configuration files
├── src/
│   ├── core/          # Core framework functionality
│   ├── tests/         # Test files organized by type
│   ├── pages/         # Page Object Models
│   ├── fixtures/      # Reusable test fixtures
│   └── utils/         # Utility functions
└── test-data/         # Test data and mocks
```

### Writing Your First Test

1. **Create a test file:**
```typescript
// src/tests/e2e/example.test.ts
import { test, expect } from '@playwright/test';

test('basic test example', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  const title = await page.title();
  expect(title).toContain('Playwright');

  await expect(page.locator('h1')).toBeVisible();
});
```

2. **Run your test:**
```bash
npx playwright test src/tests/e2e/example.test.ts
```

### Using Page Objects

```typescript
// src/tests/e2e/login-example.test.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/auth/login';

test('login with page object', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.login('username', 'password');

  await expect(page).toHaveURL(/dashboard/);
});
```

### Using Helper Functions

```typescript
import { fillInputField, clickElement } from '../../core/actions/web/webActions';

test('using web actions', async ({ page }) => {
  await page.goto('https://example.com/login');

  await fillInputField(page, '#username', 'testuser');
  await fillInputField(page, '#password', 'testpass');
  await clickElement(page, '#submit');
});
```

### Next Steps

- Read [Writing Tests Guide](./WRITING_TESTS.md)
- Learn about [Best Practices](./BEST_PRACTICES.md)
- Explore [API Testing](../api/API_FUNCTIONS_REFERENCE.md)
- Check out [JWT Authentication](../api/JWT_TOKEN_AUTH.md)

### Troubleshooting

**Tests failing with timeout errors?**
- Increase timeout in `config/playwright.config.ts`
- Check network connectivity
- Verify selectors are correct

**Import errors?**
- Run `pnpm install` again
- Check TypeScript configuration
- Verify file paths

**Browser not launching?**
- Run `npx playwright install`
- Check system requirements
- Try running in headed mode for debugging

### Getting Help

- Check the [documentation](../README.md)
- Review [example tests](../../src/tests/)
- Open an issue on [GitHub](https://github.com/dipjyotimetia/PlaywrightTestFramework/issues)
