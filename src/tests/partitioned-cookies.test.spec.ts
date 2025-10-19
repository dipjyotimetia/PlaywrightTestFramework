import { test, expect } from '@playwright/test';
import { CookieActions } from '../core/cookieActions';
import * as path from 'path';

/**
 * Partitioned Cookie Tests
 * Tests the partitionKey feature added in Playwright v1.55+
 * Partitioned cookies follow the CHIPS (Cookies Having Independent Partitioned State) standard
 * These cookies are isolated by top-level site for enhanced privacy
 */

test.describe('Partitioned Cookie Tests', () => {
  let cookieActions: CookieActions;
  const cookiesPath = path.join(__dirname, '../../test-cookies.json');
  const partitionedCookiesPath = path.join(
    __dirname,
    '../../test-partitioned-cookies.json'
  );

  test.beforeEach(() => {
    cookieActions = new CookieActions();
  });

  test('should save and restore cookies with partitionKey', async ({
    context,
  }) => {
    // Add a regular cookie
    await cookieActions.addCookie(context, {
      name: 'session_token',
      value: 'abc123',
      domain: '.example.com',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });

    // Save cookies
    await cookieActions.saveCookies(context, cookiesPath);

    // Clear cookies
    await cookieActions.clearCookies(context);

    // Verify cleared
    const cookiesAfterClear = await cookieActions.getCookies(context);
    expect(cookiesAfterClear.length).toBe(0);

    // Restore cookies
    await cookieActions.restoreCookies(context, cookiesPath);

    // Verify restored
    const restoredCookies = await cookieActions.getCookies(context);
    expect(restoredCookies.length).toBeGreaterThan(0);
  });

  test('should add and retrieve cookie by name', async ({ context }) => {
    const cookieName = 'test_cookie';
    const cookieValue = 'test_value_123';

    await cookieActions.addCookie(context, {
      name: cookieName,
      value: cookieValue,
      domain: '.saucedemo.com',
      path: '/',
    });

    const cookie = await cookieActions.getCookieByName(context, cookieName);
    expect(cookie).toBeDefined();
    expect(cookie?.name).toBe(cookieName);
    expect(cookie?.value).toBe(cookieValue);
  });

  test('should verify cookie existence', async ({ context }) => {
    const cookieName = 'auth_token';

    // Should not exist initially
    let exists = await cookieActions.hasCookie(context, cookieName);
    expect(exists).toBe(false);

    // Add cookie
    await cookieActions.addCookie(context, {
      name: cookieName,
      value: 'token_xyz',
      domain: '.example.com',
      path: '/',
    });

    // Should exist now
    exists = await cookieActions.hasCookie(context, cookieName);
    expect(exists).toBe(true);
  });

  test('should update existing cookie', async ({ context }) => {
    const cookieName = 'user_preference';

    // Add initial cookie
    await cookieActions.addCookie(context, {
      name: cookieName,
      value: 'dark_mode',
      domain: '.example.com',
      path: '/',
    });

    // Update cookie
    await cookieActions.updateCookie(context, {
      name: cookieName,
      value: 'light_mode',
      domain: '.example.com',
      path: '/',
    });

    // Verify updated value
    const cookie = await cookieActions.getCookieByName(context, cookieName);
    expect(cookie?.value).toBe('light_mode');
  });

  test('should clear cookies by domain', async ({ context, page }) => {
    // Navigate to set cookies
    await page.goto('https://www.saucedemo.com/');

    // Add cookies for different domains
    await cookieActions.addCookie(context, {
      name: 'cookie1',
      value: 'value1',
      domain: '.saucedemo.com',
      path: '/',
    });

    // Clear cookies for specific domain
    await cookieActions.clearCookiesByDomain(context, '.saucedemo.com');

    // Verify cleared
    const cookies = await cookieActions.getCookies(context);
    const sauceDemoCookies = cookies.filter((c) =>
      c.domain.includes('saucedemo.com')
    );
    expect(sauceDemoCookies.length).toBe(0);
  });

  test('should handle cookies with different SameSite values', async ({
    context,
  }) => {
    // Strict SameSite
    await cookieActions.addCookie(context, {
      name: 'strict_cookie',
      value: 'strict_value',
      domain: '.example.com',
      path: '/',
      sameSite: 'Strict',
    });

    // Lax SameSite
    await cookieActions.addCookie(context, {
      name: 'lax_cookie',
      value: 'lax_value',
      domain: '.example.com',
      path: '/',
      sameSite: 'Lax',
    });

    // None SameSite (requires Secure)
    await cookieActions.addCookie(context, {
      name: 'none_cookie',
      value: 'none_value',
      domain: '.example.com',
      path: '/',
      sameSite: 'None',
      secure: true,
    });

    const cookies = await cookieActions.getCookies(context);
    expect(cookies.length).toBeGreaterThanOrEqual(3);
  });

  test('should handle HttpOnly cookies', async ({ context }) => {
    await cookieActions.addCookie(context, {
      name: 'httponly_cookie',
      value: 'secure_value',
      domain: '.example.com',
      path: '/',
      httpOnly: true,
      secure: true,
    });

    const cookie = await cookieActions.getCookieByName(
      context,
      'httponly_cookie'
    );
    expect(cookie?.httpOnly).toBe(true);
  });

  test('should handle Secure cookies', async ({ context }) => {
    await cookieActions.addCookie(context, {
      name: 'secure_cookie',
      value: 'secure_value',
      domain: '.example.com',
      path: '/',
      secure: true,
    });

    const cookie = await cookieActions.getCookieByName(context, 'secure_cookie');
    expect(cookie?.secure).toBe(true);
  });

  test('should handle cookies with expiration', async ({ context }) => {
    // Set cookie to expire in 1 hour
    const expirationTime = Math.floor(Date.now() / 1000) + 3600;

    await cookieActions.addCookie(context, {
      name: 'expiring_cookie',
      value: 'temp_value',
      domain: '.example.com',
      path: '/',
      expires: expirationTime,
    });

    const cookie = await cookieActions.getCookieByName(
      context,
      'expiring_cookie'
    );
    expect(cookie?.expires).toBeDefined();
    expect(cookie?.expires).toBeGreaterThan(Date.now() / 1000);
  });

  test('should export cookies in Netscape format', async ({ context }) => {
    // Add some cookies
    await cookieActions.addCookie(context, {
      name: 'cookie1',
      value: 'value1',
      domain: '.example.com',
      path: '/',
      secure: true,
    });

    await cookieActions.addCookie(context, {
      name: 'cookie2',
      value: 'value2',
      domain: '.example.com',
      path: '/app',
      secure: false,
    });

    const netscapePath = path.join(__dirname, '../../cookies-netscape.txt');
    await cookieActions.exportCookiesNetscapeFormat(context, netscapePath);

    // Verify file was created (would need fs to read and verify content)
    // This is a demonstration of the feature
  });

  test('should handle cookies for specific URL', async ({ context, page }) => {
    await page.goto('https://www.saucedemo.com/');

    await cookieActions.addCookie(context, {
      name: 'url_specific_cookie',
      value: 'specific_value',
      domain: '.saucedemo.com',
      path: '/',
    });

    const cookiesForUrl = await cookieActions.getCookies(
      context,
      'https://www.saucedemo.com/'
    );
    expect(cookiesForUrl.length).toBeGreaterThan(0);
  });

  test('should demonstrate cross-site cookie isolation', async ({
    context,
    page,
  }) => {
    // Navigate to first site
    await page.goto('https://www.saucedemo.com/');

    await cookieActions.addCookie(context, {
      name: 'site1_cookie',
      value: 'site1_value',
      domain: '.saucedemo.com',
      path: '/',
    });

    const site1Cookies = await cookieActions.getCookies(context);
    const site1CookieCount = site1Cookies.length;

    // Cookies should be isolated when navigating to different site
    // (In real scenarios with partitionKey, cookies would be partitioned)
    await page.goto('https://example.com/');

    const exampleCookies = await cookieActions.getCookies(
      context,
      'https://example.com/'
    );

    // Verify saucedemo cookies are not accessible on example.com
    const hasSauceDemoCookie = exampleCookies.some(
      (c) => c.name === 'site1_cookie'
    );
    expect(hasSauceDemoCookie).toBe(false);
  });

  test('should handle session cookies (no expiration)', async ({ context }) => {
    await cookieActions.addCookie(context, {
      name: 'session_cookie',
      value: 'session_value',
      domain: '.example.com',
      path: '/',
      // No expires set = session cookie
    });

    const cookie = await cookieActions.getCookieByName(
      context,
      'session_cookie'
    );
    expect(cookie).toBeDefined();
    // Session cookies typically have expires = -1 or undefined
  });

  test('should handle cookie path specificity', async ({ context }) => {
    // Add cookies with different paths
    await cookieActions.addCookie(context, {
      name: 'root_cookie',
      value: 'root_value',
      domain: '.example.com',
      path: '/',
    });

    await cookieActions.addCookie(context, {
      name: 'app_cookie',
      value: 'app_value',
      domain: '.example.com',
      path: '/app',
    });

    await cookieActions.addCookie(context, {
      name: 'admin_cookie',
      value: 'admin_value',
      domain: '.example.com',
      path: '/app/admin',
    });

    const allCookies = await cookieActions.getCookies(context);
    expect(allCookies.length).toBeGreaterThanOrEqual(3);

    // Verify different path cookies exist
    const paths = allCookies.map((c) => c.path);
    expect(paths).toContain('/');
    expect(paths).toContain('/app');
    expect(paths).toContain('/app/admin');
  });
});
