import { test, expect } from '@playwright/test';
import { AuthSetup, AuthConfig } from '../../../core/auth/authSetup';
import { TokenManager } from '../../../core/auth/tokenManager';

test.describe('JWT Token Capture', () => {
  test.skip('should capture JWT token from localStorage after login', async () => {
    const authSetup = new AuthSetup();

    // Example configuration - adjust to match your application
    const config: AuthConfig = {
      loginUrl: 'https://example.com/login',
      usernameSelector: '#username',
      passwordSelector: '#password',
      submitSelector: 'button[type="submit"]',
      username: process.env.TEST_USERNAME || 'testuser@example.com',
      password: process.env.TEST_PASSWORD || 'testpassword',
      tokenLocation: 'localStorage',
      tokenKey: 'authToken', // or 'token', 'access_token', etc.
      expectedUrlAfterLogin: 'https://example.com/dashboard',
      headless: false, // Set to true in CI
    };

    const tokenData = await authSetup.captureToken(config);

    expect(tokenData).not.toBeNull();
    expect(tokenData?.token).toBeTruthy();
    console.log('Captured token:', tokenData?.token);
  });

  test.skip('should capture JWT token from response header', async () => {
    const authSetup = new AuthSetup();

    const config: AuthConfig = {
      loginUrl: 'https://example.com/login',
      usernameSelector: '#email',
      passwordSelector: '#password',
      submitSelector: 'button[type="submit"]',
      username: process.env.TEST_USERNAME || 'testuser@example.com',
      password: process.env.TEST_PASSWORD || 'testpassword',
      tokenLocation: 'header',
      expectedUrlAfterLogin: 'https://example.com/dashboard',
      headless: false,
    };

    const tokenData = await authSetup.captureToken(config);

    expect(tokenData).not.toBeNull();
    expect(tokenData?.token).toBeTruthy();
    console.log('Captured token from header:', tokenData?.token);
  });

  test.skip('should capture JWT token from cookie', async () => {
    const authSetup = new AuthSetup();

    const config: AuthConfig = {
      loginUrl: 'https://example.com/login',
      usernameSelector: 'input[name="email"]',
      passwordSelector: 'input[name="password"]',
      submitSelector: 'button[type="submit"]',
      username: process.env.TEST_USERNAME || 'testuser@example.com',
      password: process.env.TEST_PASSWORD || 'testpassword',
      tokenLocation: 'cookie',
      tokenKey: 'jwt',
      expectedUrlAfterLogin: 'https://example.com/home',
      headless: false,
    };

    const tokenData = await authSetup.captureToken(config);

    expect(tokenData).not.toBeNull();
    expect(tokenData?.token).toBeTruthy();
    console.log('Captured token from cookie:', tokenData?.token);
  });

  test('should load saved token from file', async () => {
    const tokenManager = new TokenManager();
    const tokenData = await tokenManager.loadToken();

    if (tokenData) {
      console.log('Loaded token:', tokenData.token);
      console.log('Captured at:', new Date(tokenData.capturedAt).toISOString());
      console.log('Expires at:', tokenData.expiresAt ? new Date(tokenData.expiresAt).toISOString() : 'N/A');
      console.log('Is expired:', tokenManager.isTokenExpired(tokenData));
    } else {
      console.log('No token found. Run a token capture test first.');
    }
  });

  test('should decode JWT token expiry', () => {
    // Example JWT token (this is a sample, not a real token)
    const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzAwMDAwMDB9.4Adcj0vfGmJb-fO5UcxXW-YaC4WCdBzPQxQ6aZBLCMY';

    const expiry = TokenManager.decodeTokenExpiry(sampleToken);

    expect(expiry).toBeTruthy();
    if (expiry) {
      console.log('Token expires at:', new Date(expiry).toISOString());
    }
  });
});
