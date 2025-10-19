# Best Practices

## Test Writing Best Practices

### 1. Test Independence
```typescript
// ✅ GOOD - Each test is independent
test('user can login', async ({ page }) => {
  await page.goto('/login');
  // test logic
});

test('user can view profile', async ({ page }) => {
  // Setup needed state
  await page.goto('/profile');
  // test logic
});

// ❌ BAD - Tests depend on each other
test('user can login', async ({ page }) => {
  await page.goto('/login');
  // leaves user logged in
});

test('user can view profile', async ({ page }) => {
  // Assumes user is already logged in
  await page.goto('/profile');
});
```

### 2. Use Page Object Model
```typescript
// ✅ GOOD - Using Page Objects
import { LoginPage } from '../../pages/auth/login';

test('login flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('user', 'pass');
});

// ❌ BAD - Direct page interactions in test
test('login flow', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#username', 'user');
  await page.fill('#password', 'pass');
  await page.click('#submit');
});
```

### 3. Meaningful Test Names
```typescript
// ✅ GOOD - Descriptive names
test('should display error message when login with invalid credentials', async ({ page }) => {
  // test logic
});

// ❌ BAD - Vague names
test('test1', async ({ page }) => {
  // test logic
});
```

### 4. Use Fixtures for Setup
```typescript
// ✅ GOOD - Using fixtures
import { test } from '../../fixtures/authFixtures';

test('authenticated user can access dashboard', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard');
  // test logic
});

// ❌ BAD - Setup in every test
test('access dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#username', 'user');
  await page.fill('#password', 'pass');
  await page.click('#submit');
  await page.goto('/dashboard');
  // test logic
});
```

### 5. Wait for Elements Properly
```typescript
// ✅ GOOD - Auto-waiting with assertions
await expect(page.locator('#result')).toBeVisible();

// ✅ GOOD - Explicit wait for specific condition
await page.waitForSelector('#result', { state: 'visible' });

// ❌ BAD - Hard-coded waits
await page.waitForTimeout(3000);
```

### 6. Use Constants
```typescript
// ✅ GOOD - Using constants
import { URLS, TIMEOUTS } from '../../constants';

test('navigate to product page', async ({ page }) => {
  await page.goto(URLS.PRODUCTS, { timeout: TIMEOUTS.NAVIGATION });
});

// ❌ BAD - Magic values
test('navigate to product page', async ({ page }) => {
  await page.goto('https://example.com/products', { timeout: 30000 });
});
```

## Code Organization

### 1. Group Related Tests
```typescript
// ✅ GOOD - Grouped by feature
test.describe('User Authentication', () => {
  test('should login successfully', async ({ page }) => {});
  test('should show error for invalid credentials', async ({ page }) => {});
  test('should logout successfully', async ({ page }) => {});
});

// ❌ BAD - Scattered tests
test('login test', async ({ page }) => {});
test('product test', async ({ page }) => {});
test('logout test', async ({ page }) => {});
```

### 2. Use Helper Functions
```typescript
// ✅ GOOD - Reusable helpers
import { fillInputField, clickElement } from '../../core/actions/web/webActions';

test('fill form', async ({ page }) => {
  await fillInputField(page, '#email', 'test@example.com');
  await clickElement(page, '#submit');
});

// ❌ BAD - Repeating code
test('fill form', async ({ page }) => {
  await page.fill('#email', 'test@example.com');
  await page.click('#submit');
});
```

### 3. Proper Error Handling
```typescript
// ✅ GOOD - Proper error handling
test('handle API error', async ({ page }) => {
  try {
    await page.goto('/api/data');
  } catch (error) {
    console.error('Navigation failed:', error);
    throw error;
  }
});

// Use soft assertions when appropriate
await expect.soft(page.locator('#optional')).toBeVisible();
await expect(page.locator('#required')).toBeVisible();
```

## Performance Best Practices

### 1. Parallel Execution
```typescript
// Run tests in parallel (default)
test.describe.configure({ mode: 'parallel' });

test('test 1', async ({ page }) => {});
test('test 2', async ({ page }) => {});
```

### 2. Efficient Selectors
```typescript
// ✅ GOOD - Specific, fast selectors
await page.click('[data-testid="submit-button"]');

// ❌ BAD - Slow, fragile selectors
await page.click('div > div > div > button:nth-child(3)');
```

### 3. Reuse Browser Contexts
```typescript
// ✅ GOOD - Using fixtures to reuse context
import { test } from '../../fixtures/baseFixtures';

test('test with shared context', async ({ page }) => {
  // Context is reused
});
```

## API Testing Best Practices

### 1. Type-Safe Responses
```typescript
// ✅ GOOD - Type-safe API responses
import { getJsonResponse } from '../../core/actions/api/apiActions';

interface User {
  id: number;
  name: string;
}

test('get user', async ({ request }) => {
  const response = await request.get('/api/users/1');
  const user = await getJsonResponse<User>(response);
  expect(user.name).toBeTruthy();
});
```

### 2. Mock API When Needed
```typescript
// ✅ GOOD - Mocking external APIs
import { mockApiResponse } from '../../core/actions/web/webActions';

test('with mocked API', async ({ page }) => {
  await mockApiResponse(page, '**/api/users', {
    status: 200,
    body: { users: [{ id: 1, name: 'Test' }] }
  });

  await page.goto('/users');
  // Test UI with mocked data
});
```

## Security Best Practices

### 1. Never Commit Secrets
```typescript
// ✅ GOOD - Using environment variables
const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;

// ❌ BAD - Hardcoded credentials
const username = 'admin@example.com';
const password = 'SuperSecret123';
```

### 2. Use Secure Token Storage
```typescript
// ✅ GOOD - Using token manager
import { authHelper } from '../../core/auth/authHelper';

const token = await authHelper.getValidToken();

// Tokens are stored in .auth/ (git-ignored)
```

## Debugging Best Practices

### 1. Use Debug Mode
```bash
# Run in headed mode with slowMo
PWDEBUG=1 npx playwright test

# Pause in test
await page.pause();
```

### 2. Take Screenshots on Failure
```typescript
test('example test', async ({ page }, testInfo) => {
  // Test logic

  // On failure, screenshot is auto-captured
  // Configure in playwright.config.ts
});
```

### 3. Use Trace Viewer
```bash
# Run with trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

## CI/CD Best Practices

### 1. Run Tests in Headless Mode
```typescript
// In playwright.config.ts
use: {
  headless: process.env.CI === 'true',
}
```

### 2. Shard Tests for Faster Execution
```bash
# Run tests in 4 shards
npx playwright test --shard=1/4
npx playwright test --shard=2/4
npx playwright test --shard=3/4
npx playwright test --shard=4/4
```

### 3. Generate and Store Reports
```yaml
# In .github/workflows/ci.yml
- name: Upload test results
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Maintenance Best Practices

### 1. Keep Dependencies Updated
```bash
# Check for updates
pnpm outdated

# Update dependencies
pnpm update

# Update Playwright
pnpm update @playwright/test
npx playwright install
```

### 2. Regular Code Reviews
- Review test code like production code
- Check for duplication
- Verify test coverage
- Ensure tests are maintainable

### 3. Clean Up Test Data
```typescript
test.afterEach(async () => {
  // Clean up test data
  await cleanupTestData();
});
```

## Common Anti-Patterns to Avoid

### ❌ Avoid These Patterns

1. **Sleeping instead of waiting**
```typescript
// ❌ BAD
await page.waitForTimeout(5000);

// ✅ GOOD
await page.waitForSelector('#element');
```

2. **Testing implementation details**
```typescript
// ❌ BAD - Testing internal state
expect(component.state.isLoading).toBe(false);

// ✅ GOOD - Testing behavior
await expect(page.locator('.loading')).not.toBeVisible();
```

3. **One assertion per test (too granular)**
```typescript
// ❌ BAD - Too granular
test('check title', async ({ page }) => {
  expect(await page.title()).toBe('Home');
});

test('check heading', async ({ page }) => {
  await expect(page.locator('h1')).toBeVisible();
});

// ✅ GOOD - Related assertions together
test('verify homepage', async ({ page }) => {
  expect(await page.title()).toBe('Home');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('nav')).toBeVisible();
});
```

4. **Testing multiple things in one test**
```typescript
// ❌ BAD - Testing too much
test('user flow', async ({ page }) => {
  // Login
  // Create product
  // Edit product
  // Delete product
  // Logout
  // This should be 5 separate tests
});
```

## Summary

✅ **DO:**
- Write independent tests
- Use Page Objects
- Use fixtures for setup
- Use constants and environment variables
- Write meaningful test names
- Handle errors properly
- Keep tests focused and simple

❌ **DON'T:**
- Use hard-coded waits
- Hardcode credentials or secrets
- Make tests depend on each other
- Use fragile selectors
- Test too much in one test
- Ignore test failures
