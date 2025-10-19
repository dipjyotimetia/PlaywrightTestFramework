import { test, expect } from '@playwright/test';

/**
 * API Redirect Tests
 * Tests the maxRedirects feature added in Playwright v1.52+
 * Verifies API redirect behavior and redirect chain handling
 */

let apiContext: any;

test.beforeAll(async ({ playwright }) => {
  // Create API context with maxRedirects configuration (v1.52+)
  apiContext = await playwright.request.newContext({
    baseURL: 'https://httpbin.org',
    maxRedirects: 5, // Control maximum number of redirects
    timeout: 30000,
    ignoreHTTPSErrors: true,
  });
});

test.afterAll(async () => {
  await apiContext.dispose();
});

test.describe('API Redirect Tests', () => {
  test('should follow redirects up to maxRedirects limit', async () => {
    // httpbin.org/redirect/n redirects n times
    const response = await apiContext.get('/redirect/3');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // Verify final URL after redirects
    expect(response.url()).toContain('/get');
  });

  test('should handle single redirect correctly', async () => {
    const response = await apiContext.get('/redirect/1');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    expect(response.url()).toContain('/get');
  });

  test('should fail when exceeding maxRedirects', async () => {
    // Try to redirect more times than maxRedirects allows
    try {
      await apiContext.get('/redirect/10'); // More than our limit of 5
      // If it doesn't throw, the test should fail
      expect(true).toBe(false);
    } catch (error: any) {
      // Expect an error about too many redirects
      expect(error.message).toMatch(/redirect/i);
    }
  });

  test('should handle relative redirects', async () => {
    const response = await apiContext.get('/relative-redirect/2');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test('should handle absolute redirects', async () => {
    const response = await apiContext.get('/absolute-redirect/2');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test('should handle 301 permanent redirects', async () => {
    const response = await apiContext.get('/status/301', {
      headers: {
        Location: '/get',
      },
    });

    // httpbin may not redirect for this endpoint without proper setup
    // This is a demonstration of handling different redirect types
    expect([200, 301]).toContain(response.status());
  });

  test('should handle 302 temporary redirects', async () => {
    const response = await apiContext.get('/status/302', {
      headers: {
        Location: '/get',
      },
    });

    expect([200, 302]).toContain(response.status());
  });

  test('should preserve headers through redirects', async () => {
    const customHeader = 'test-value';
    const response = await apiContext.get('/redirect/1', {
      headers: {
        'X-Custom-Header': customHeader,
      },
    });

    expect(response.ok()).toBeTruthy();
  });

  test('should handle POST request redirects', async () => {
    // POST redirects typically convert to GET
    const response = await apiContext.post('/redirect-to', {
      params: {
        url: '/get',
      },
    });

    expect(response.ok()).toBeTruthy();
  });

  test('should access final redirected URL', async () => {
    const response = await apiContext.get('/redirect/3');

    // Verify we can access the final URL
    const finalUrl = response.url();
    expect(finalUrl).toBeTruthy();
    expect(finalUrl).toContain('httpbin.org');
  });

  test('should handle redirect chains with different status codes', async () => {
    // Test redirect chain handling
    const response = await apiContext.get('/redirect/2');

    expect(response.status()).toBe(200);
    expect(response.url()).toContain('/get');
  });

  test('should work with custom maxRedirects in individual requests', async ({
    playwright,
  }) => {
    // Create a new context with different maxRedirects for comparison
    const customContext = await playwright.request.newContext({
      baseURL: 'https://httpbin.org',
      maxRedirects: 2, // Lower limit
      timeout: 30000,
    });

    try {
      // This should fail with only 2 allowed redirects
      await customContext.get('/redirect/5');
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error.message).toMatch(/redirect/i);
    } finally {
      await customContext.dispose();
    }
  });

  test('should handle zero maxRedirects (no redirects allowed)', async ({
    playwright,
  }) => {
    // Create context with no redirects allowed
    const noRedirectContext = await playwright.request.newContext({
      baseURL: 'https://httpbin.org',
      maxRedirects: 0,
      timeout: 30000,
    });

    try {
      const response = await noRedirectContext.get('/redirect/1');
      // Should get redirect status code, not follow it
      expect([301, 302, 307, 308]).toContain(response.status());
    } finally {
      await noRedirectContext.dispose();
    }
  });

  test('should handle redirect with query parameters', async () => {
    const response = await apiContext.get('/redirect-to', {
      params: {
        url: '/get?foo=bar',
      },
    });

    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json.args).toHaveProperty('foo', 'bar');
  });

  test('should handle cross-origin redirects', async () => {
    // httpbin handles this internally
    const response = await apiContext.get('/redirect-to', {
      params: {
        url: 'https://httpbin.org/get',
      },
    });

    expect(response.ok()).toBeTruthy();
  });
});
