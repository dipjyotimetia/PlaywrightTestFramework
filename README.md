# 🎭 Playwright Test Framework

A comprehensive, production-ready test automation framework built with Playwright and TypeScript.

## 🚀 Quick Start

```bash
# Clone repository
git clone git@github.com:dipjyotimetia/PlaywrightTestFramework.git
cd PlaywrightTestFramework

# Install dependencies
pnpm install

# Run tests
npx playwright test
```

📖 **[Full Getting Started Guide](./docs/guides/GETTING_STARTED.md)**

---

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Key Capabilities](#key-capabilities)
- [Contributing](#contributing)

---

## ✨ Features

- 🎯 **100+ Helper Functions** - Comprehensive web and API testing actions
- 🔐 **JWT Authentication** - Built-in token management and capture
- 🧪 **Multiple Test Types** - E2E, API, Accessibility, Integration, Visual
- 📊 **Rich Reporting** - Allure, HTML, JSON, GitHub Actions integration
- 🐳 **Docker Support** - Containerized execution
- 🔄 **CI/CD Ready** - GitHub Actions workflows included
- 📱 **Cross-Browser** - Chromium, Firefox, WebKit support
- 🎨 **Page Object Model** - Maintainable test architecture
- 🛠️ **TypeScript** - Type-safe test development
- 📦 **Reusable Fixtures** - Shared test setups

---

## 📁 Project Structure

```
PlaywrightTestFramework/
├── docs/                    # 📚 All documentation
│   ├── api/                 # API testing guides
│   ├── web/                 # Web testing guides
│   ├── guides/              # How-to guides
│   └── architecture/        # Architecture docs
├── src/
│   ├── core/                # Core framework functionality
│   │   ├── apiActions.ts    # API testing actions (22 functions)
│   │   ├── webActions.ts    # Web testing actions (99+ functions)
│   │   ├── authSetup.ts     # JWT token capture
│   │   ├── authHelper.ts    # Auth utilities
│   │   └── tokenManager.ts  # Token management
│   ├── pages/               # Page Object Models
│   ├── tests/               # Test files
│   ├── config/              # Configuration files
│   └── helpers/             # Utility functions
├── playwright.config.ts     # Playwright configuration
└── package.json             # Dependencies

```

---

## 📚 Documentation

### Getting Started
- **[Getting Started Guide](./docs/guides/GETTING_STARTED.md)** - Installation and first test
- **[Best Practices](./docs/guides/BEST_PRACTICES.md)** - Coding standards and patterns
- **[Migration Guide](./docs/MIGRATION_GUIDE.md)** - Project structure improvements

### API Testing
- **[API Functions Reference](./docs/api/API_FUNCTIONS_REFERENCE.md)** - 22 API testing functions
- **[JWT Token Authentication](./docs/api/JWT_TOKEN_AUTH.md)** - Token capture and usage

### Web Testing
- **[Web Actions Reference](./docs/web/WEB_ACTIONS_REFERENCE.md)** - 99+ web testing functions

### Architecture
- **[Structure Improvement Plan](./docs/architecture/PROJECT_STRUCTURE_IMPROVEMENT_PLAN.md)** - Modernization roadmap
- **[Enhancements](./docs/ENHANCEMENTS.md)** - Latest features

---

## 🔧 Prerequisites

- **Node.js** >= 20.x
- **pnpm** >= 9.x
- **Git**
- **Docker** (optional, for containerized execution)

---

## 📦 Installation

### 1. Clone and Install

```bash
git clone git@github.com:dipjyotimetia/PlaywrightTestFramework.git
cd PlaywrightTestFramework
pnpm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install
```

### 3. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

---

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests
npx playwright test

# Run in headed mode
npm run test:playwright

# Run specific test file
npx playwright test src/tests/api.test.spec.ts

# Run tests by browser
npx playwright test --project=chromium

# Run with UI mode
npx playwright test --ui

# Debug mode
PWDEBUG=1 npx playwright test
```

### Test Organization

```bash
# API tests
npx playwright test src/tests/api*.test.spec.ts

# E2E tests
npx playwright test src/tests/sause.test.spec.ts

# Accessibility tests
npx playwright test src/tests/accessibility.test.spec.ts

# Example tests
npx playwright test src/tests/*examples*.test.spec.ts
```

### Reports

```bash
# Generate Allure report
npm run allureReport

# View HTML report
npx playwright show-report
```

---

## 🎯 Key Capabilities

### 1. Web Testing (99+ Functions)

```typescript
import {
  navigateToUrl,
  fillInputField,
  clickElement,
  isElementVisible
} from './src/core/webActions';

test('login flow', async ({ page }) => {
  await navigateToUrl(page, 'https://example.com/login');
  await fillInputField(page, '#email', 'user@example.com');
  await fillInputField(page, '#password', 'password123');
  await clickElement(page, '#submit');

  const isLoggedIn = await isElementVisible(page, '.dashboard');
  expect(isLoggedIn).toBeTruthy();
});
```

### 2. API Testing (22 Functions)

```typescript
import { httpGet, httpPost, getJsonResponse } from './src/core/apiActions';

test('API test', async () => {
  const response = await httpGet('https://api.example.com/users/1');
  const user = await getJsonResponse(response);

  expect(user.id).toBe(1);
  expect(response.ok()).toBeTruthy();
});
```

### 3. JWT Authentication

```typescript
import { AuthSetup } from './src/core/authSetup';

const authSetup = new AuthSetup();
const tokenData = await authSetup.captureToken({
  loginUrl: 'https://example.com/login',
  usernameSelector: '#username',
  passwordSelector: '#password',
  submitSelector: 'button[type="submit"]',
  username: process.env.TEST_USERNAME,
  password: process.env.TEST_PASSWORD,
  tokenLocation: 'localStorage',
  tokenKey: 'authToken',
});

// Token automatically used in API requests!
```

### 4. Page Object Model

```typescript
import { LoginPage } from './src/pages/login';

test('login with POM', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('username', 'password');
});
```

### 5. Network Mocking

```typescript
import { mockApiResponse } from './src/core/webActions';

test('with mocked API', async ({ page }) => {
  await mockApiResponse(page, '**/api/users', {
    status: 200,
    body: { users: [{ id: 1, name: 'Test User' }] }
  });

  await page.goto('/users');
  // UI now uses mocked data
});
```

---

## 🔐 Authentication

The framework includes built-in JWT token management:

1. **Capture tokens** via browser automation
2. **Store securely** in `.auth/tokens.json` (git-ignored)
3. **Auto-refresh** when expired
4. **Automatic injection** in API requests

See [JWT Authentication Guide](./docs/api/JWT_TOKEN_AUTH.md) for details.

---

## 🐳 Docker Support

```bash
# Build image
docker build -t playwright-tests .

# Run tests
docker run playwright-tests

# With docker-compose
docker-compose up
```

---

## 📊 Reporting

### Allure Reports

```bash
npm run allureReport
```

### HTML Reports

```bash
npx playwright show-report
```

### GitHub Actions Integration

Reports are automatically published in CI/CD pipeline.

---

## 🛠️ Tech Stack

- **[Playwright](https://playwright.dev/)** - Cross-browser automation
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Allure](https://docs.qameta.io/allure/)** - Test reporting
- **[Winston](https://github.com/winstonjs/winston)** - Logging
- **[Faker.js](https://fakerjs.dev/)** - Test data generation
- **[pnpm](https://pnpm.io/)** - Fast package manager

---

## 📖 Learn More

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Allure Framework](https://docs.qameta.io/allure/)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npx playwright test`
5. Submit a pull request

---

## 📝 License

ISC © Dipjyoti Metia

---

## 🐛 Issues

Report issues at: https://github.com/dipjyotimetia/PlaywrightTestFramework/issues

---

## ⭐ Show Your Support

Give a ⭐ if this project helped you!

---

**Made with ❤️ using Playwright**
