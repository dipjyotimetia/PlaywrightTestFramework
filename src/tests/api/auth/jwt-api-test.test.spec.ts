import { test, expect } from '@playwright/test';
import { httpGet, httpPost, getCurrentToken } from '../../../core/actions/api/apiActions';
import { authHelper } from '../../../core/auth/authHelper';
import { AuthConfig } from '../../../core/auth/authSetup';

test.describe('API Tests with JWT Authentication', () => {
  test.beforeAll(async () => {
    // Configure auth settings for token refresh if needed
    const authConfig: AuthConfig = {
      loginUrl: 'https://example.com/login',
      usernameSelector: '#username',
      passwordSelector: '#password',
      submitSelector: 'button[type="submit"]',
      username: process.env.TEST_USERNAME || 'testuser@example.com',
      password: process.env.TEST_PASSWORD || 'testpassword',
      tokenLocation: 'localStorage',
      tokenKey: 'authToken',
      expectedUrlAfterLogin: 'https://example.com/dashboard',
      headless: true,
    };

    authHelper.setAuthConfig(authConfig);
  });

  test.skip('should make authenticated GET request using stored JWT', async () => {
    // The token is automatically loaded from .auth/tokens.json in apiActions.ts
    const response = await httpGet('https://api.example.com/user/profile');

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log('Profile data:', data);
  });

  test.skip('should make authenticated POST request using stored JWT', async () => {
    const payload = {
      title: 'Test Post',
      content: 'This is a test post created with JWT authentication',
    };

    const response = await httpPost('https://api.example.com/posts', payload);

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    console.log('Created post:', data);
  });

  test.skip('should refresh token if expired and retry request', async () => {
    // Get current token
    let token = await getCurrentToken();
    console.log('Current token:', token ? 'exists' : 'not found');

    // If token is expired or not found, refresh it
    if (!token) {
      console.log('Refreshing token...');
      token = await authHelper.getValidToken();
      console.log('New token obtained:', token ? 'success' : 'failed');
    }

    // Make API request
    const response = await httpGet('https://api.example.com/data');
    expect(response.ok()).toBeTruthy();
  });

  test.skip('should handle multiple API requests with same token', async () => {
    const endpoints = [
      'https://api.example.com/user/profile',
      'https://api.example.com/user/settings',
      'https://api.example.com/user/notifications',
    ];

    for (const endpoint of endpoints) {
      const response = await httpGet(endpoint);
      expect(response.ok()).toBeTruthy();
      console.log(`${endpoint}: ${response.status()}`);
    }
  });

  test('should verify token is loaded from storage', async () => {
    const token = await getCurrentToken();

    if (token) {
      console.log('Token loaded successfully');
      console.log('Token length:', token.length);
      console.log('Token starts with:', token.substring(0, 20) + '...');
    } else {
      console.log('No token found. Capture a token first by running jwt-token-capture tests.');
      console.log('You can capture a token by configuring and running the token capture test.');
    }
  });
});

test.describe('API Error Handling with JWT', () => {
  test.skip('should handle 401 unauthorized and refresh token', async () => {
    const response = await httpGet('https://api.example.com/protected-resource');

    if (response.status() === 401) {
      console.log('Received 401, refreshing token...');

      // Refresh token
      await authHelper.refreshToken();

      // Retry request
      const retryResponse = await httpGet(
        'https://api.example.com/protected-resource'
      );
      expect(retryResponse.ok()).toBeTruthy();
    } else {
      expect(response.ok()).toBeTruthy();
    }
  });

  test.skip('should handle token expiration gracefully', async () => {
    // Attempt request
    const response = await httpGet('https://api.example.com/data');

    if (!response.ok() && response.status() === 401) {
      console.log('Token expired, getting new token...');

      // Get valid token (will auto-refresh if needed)
      const newToken = await authHelper.getValidToken();
      expect(newToken).toBeTruthy();

      console.log('Token refreshed, retrying request...');
      // Note: You might need to reinitialize the context with the new token
      // This is handled automatically in the next test run
    }
  });
});
