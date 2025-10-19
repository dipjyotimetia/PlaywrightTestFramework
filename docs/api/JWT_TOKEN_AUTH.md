# JWT Token Authentication for API Testing

This feature allows you to capture JWT authentication tokens via browser automation and use them for API testing with Playwright.

## Overview

The JWT token authentication system consists of three main components:

1. **TokenManager** - Manages token storage and retrieval
2. **AuthSetup** - Captures tokens via browser automation
3. **AuthHelper** - Provides token refresh and validation

## Quick Start

### 1. Capture a JWT Token

First, capture a JWT token by logging in through the browser:

```typescript
import { AuthSetup } from './src/core/authSetup';

const authSetup = new AuthSetup();

const config = {
  loginUrl: 'https://your-app.com/login',
  usernameSelector: '#email',
  passwordSelector: '#password',
  submitSelector: 'button[type="submit"]',
  username: process.env.TEST_USERNAME || 'user@example.com',
  password: process.env.TEST_PASSWORD || 'password123',
  tokenLocation: 'localStorage', // or 'sessionStorage', 'cookie', 'header'
  tokenKey: 'authToken', // key name in storage
  expectedUrlAfterLogin: 'https://your-app.com/dashboard',
  headless: false, // set to true in CI
};

const tokenData = await authSetup.captureToken(config);
console.log('Token captured:', tokenData.token);
```

The token is automatically saved to `.auth/tokens.json` and will be excluded from git.

### 2. Use Token in API Tests

The token is automatically loaded in your API tests:

```typescript
import { httpGet, httpPost } from './src/core/apiActions';

// Token is automatically loaded from .auth/tokens.json
const response = await httpGet('https://api.example.com/user/profile');
const data = await response.json();
```

### 3. Handle Token Refresh

Automatically refresh expired tokens:

```typescript
import { authHelper } from './src/core/authHelper';

// Configure auth settings once
authHelper.setAuthConfig({
  loginUrl: 'https://your-app.com/login',
  // ... other config
});

// Get valid token (auto-refreshes if expired)
const token = await authHelper.getValidToken();
```

## Token Storage Locations

The system supports capturing tokens from different locations:

### localStorage
```typescript
const config = {
  tokenLocation: 'localStorage',
  tokenKey: 'authToken', // key in localStorage
  // ...
};
```

### sessionStorage
```typescript
const config = {
  tokenLocation: 'sessionStorage',
  tokenKey: 'token',
  // ...
};
```

### Cookies
```typescript
const config = {
  tokenLocation: 'cookie',
  tokenKey: 'jwt', // cookie name
  // ...
};
```

### Response Headers
```typescript
const config = {
  tokenLocation: 'header',
  // Automatically captures from Authorization header
  // Also checks response body for token fields
  // ...
};
```

## Environment Variables

Set up your credentials using environment variables:

```bash
# .env file (not committed to git)
TEST_USERNAME=testuser@example.com
TEST_PASSWORD=SecurePassword123
```

## File Structure

```
.auth/
  └── tokens.json          # Stored JWT token (excluded from git)

src/
  └── core/
      ├── tokenManager.ts  # Token storage and validation
      ├── authSetup.ts     # Browser automation for token capture
      ├── authHelper.ts    # Token refresh utilities
      └── apiActions.ts    # API request helpers (updated)
  └── tests/
      ├── jwt-token-capture.test.spec.ts  # Token capture examples
      └── jwt-api-test.test.spec.ts       # API testing examples
```

## Advanced Usage

### Custom Token Capture from Network Requests

Capture tokens from specific network requests:

```typescript
const tokenData = await authSetup.captureTokenFromRequest(
  config,
  (url) => url.includes('/api/login') || url.includes('/api/auth')
);
```

### Manual Token Management

```typescript
import { TokenManager } from './src/core/tokenManager';

const tokenManager = new TokenManager();

// Save token manually
await tokenManager.saveToken({
  token: 'your-jwt-token',
  tokenType: 'Bearer',
  expiresAt: Date.now() + 3600000, // 1 hour
  capturedAt: Date.now(),
});

// Load token
const tokenData = await tokenManager.loadToken();

// Check if expired
const isExpired = tokenManager.isTokenExpired(tokenData);

// Clear token
await tokenManager.clearToken();
```

### Decode Token Expiry

Extract expiration time from JWT:

```typescript
import { TokenManager } from './src/core/tokenManager';

const expiryTime = TokenManager.decodeTokenExpiry(jwtToken);
console.log('Expires at:', new Date(expiryTime).toISOString());
```

### Create API Context with Specific Token

```typescript
import { createContextWithToken } from './src/core/apiActions';

const customContext = await createContextWithToken('your-jwt-token');
const response = await customContext.get('https://api.example.com/data');
```

## Example Tests

### Token Capture Test

See `src/tests/jwt-token-capture.test.spec.ts` for examples of:
- Capturing tokens from localStorage
- Capturing tokens from response headers
- Capturing tokens from cookies
- Loading and validating saved tokens

### API Testing with JWT

See `src/tests/jwt-api-test.test.spec.ts` for examples of:
- Making authenticated GET/POST requests
- Handling token refresh
- Error handling for expired tokens
- Multiple API requests with same token

## Running Tests

```bash
# Capture a token (configure the test first)
npx playwright test jwt-token-capture.test.spec.ts --project=chromium

# Run API tests using captured token
npx playwright test jwt-api-test.test.spec.ts

# Run specific test
npx playwright test -g "should load saved token"
```

## CI/CD Integration

For CI environments:

1. Set environment variables in your CI platform:
```yaml
env:
  TEST_USERNAME: ${{ secrets.TEST_USERNAME }}
  TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
```

2. Use headless mode:
```typescript
const config = {
  // ...
  headless: process.env.CI === 'true',
};
```

3. Capture token as a setup step:
```yaml
- name: Capture Auth Token
  run: npx playwright test jwt-token-capture --project=chromium

- name: Run API Tests
  run: npx playwright test jwt-api-test
```

## Token Security

- Tokens are stored in `.auth/tokens.json` which is excluded from git
- Never commit tokens to version control
- Use environment variables for credentials
- Tokens include expiry validation
- Auto-refresh mechanism prevents expired token usage

## Troubleshooting

### Token not captured
- Verify selectors match your login page elements
- Check if token location is correct (localStorage vs cookie vs header)
- Ensure `expectedUrlAfterLogin` matches your app's behavior
- Set `headless: false` to debug visually

### Token expired
- The system auto-refreshes expired tokens
- Call `authHelper.getValidToken()` to force refresh
- Check token expiry: `tokenManager.isTokenExpired(tokenData)`

### API requests failing
- Verify token is loaded: `await getCurrentToken()`
- Check token format in Authorization header
- Ensure API endpoint accepts Bearer tokens
- Review response status codes and error messages

## API Reference

### TokenManager

```typescript
class TokenManager {
  async saveToken(tokenData: TokenData): Promise<void>
  async loadToken(): Promise<TokenData | null>
  async getValidToken(): Promise<string | null>
  isTokenExpired(tokenData: TokenData | null): boolean
  async clearToken(): Promise<void>
  static decodeTokenExpiry(token: string): number | undefined
}
```

### AuthSetup

```typescript
class AuthSetup {
  async captureToken(config: AuthConfig): Promise<TokenData | null>
  async captureTokenFromRequest(
    config: AuthConfig,
    requestMatcher: (url: string) => boolean
  ): Promise<TokenData | null>
}
```

### AuthHelper

```typescript
class AuthHelper {
  setAuthConfig(config: AuthConfig): void
  async getValidToken(): Promise<string>
  async refreshToken(): Promise<string>
  async clearToken(): Promise<void>
}
```

## Support

For issues or questions:
- Check the example tests in `src/tests/`
- Review this documentation
- Open an issue in the repository
