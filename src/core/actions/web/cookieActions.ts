import { BrowserContext } from '@playwright/test';
import * as fs from 'fs/promises';

/**
 * CookieActions - Cookie management utilities for Playwright
 * Provides methods for saving, restoring, and managing cookies
 * Supports Playwright v1.55+ partitioned cookies (CHIPS standard)
 */
export class CookieActions {
  /**
   * Saves all cookies from the browser context to a JSON file.
   * Includes partitionKey support for cross-site cookies (v1.55+).
   * @param context - The Playwright browser context
   * @param filePath - Path to save the cookies JSON file
   */
  async saveCookies(context: BrowserContext, filePath: string): Promise<void> {
    const cookies = await context.cookies();
    await fs.writeFile(filePath, JSON.stringify(cookies, null, 2), 'utf-8');
  }

  /**
   * Restores cookies from a JSON file to the browser context.
   * Automatically handles partitioned cookies with partitionKey.
   * @param context - The Playwright browser context
   * @param filePath - Path to the cookies JSON file
   */
  async restoreCookies(
    context: BrowserContext,
    filePath: string
  ): Promise<void> {
    const cookiesJson = await fs.readFile(filePath, 'utf-8');
    const cookies = JSON.parse(cookiesJson);
    await context.addCookies(cookies);
  }

  /**
   * Saves cookies with partition keys for cross-site scenarios.
   * Partitioned cookies are isolated by top-level site (CHIPS standard).
   * @param context - The Playwright browser context
   * @param filePath - Path to save the partitioned cookies JSON file
   */
  async savePartitionedCookies(
    context: BrowserContext,
    filePath: string
  ): Promise<void> {
    // Get all cookies including partitionKey property (v1.55+)
    const cookies = await context.cookies();

    // Filter cookies with partitionKey
    const partitionedCookies = cookies.filter(
      (cookie) => cookie.partitionKey !== undefined
    );

    await fs.writeFile(
      filePath,
      JSON.stringify(partitionedCookies, null, 2),
      'utf-8'
    );
  }

  /**
   * Restores partitioned cookies from a JSON file.
   * @param context - The Playwright browser context
   * @param filePath - Path to the partitioned cookies JSON file
   */
  async restorePartitionedCookies(
    context: BrowserContext,
    filePath: string
  ): Promise<void> {
    const cookiesJson = await fs.readFile(filePath, 'utf-8');
    const cookies = JSON.parse(cookiesJson);

    // Add cookies with partitionKey preserved
    await context.addCookies(cookies);
  }

  /**
   * Gets all cookies for a specific URL from the browser context.
   * @param context - The Playwright browser context
   * @param url - The URL to get cookies for (optional, defaults to all cookies)
   * @returns Array of cookies
   */
  async getCookies(context: BrowserContext, url?: string) {
    if (url) {
      return await context.cookies(url);
    }
    return await context.cookies();
  }

  /**
   * Gets cookies with a specific partition key.
   * Useful for testing third-party cookie scenarios.
   * @param context - The Playwright browser context
   * @param partitionKey - The partition key to filter by
   * @returns Array of cookies with matching partition key
   */
  async getCookiesByPartitionKey(
    context: BrowserContext,
    partitionKey: string
  ) {
    const allCookies = await context.cookies();
    return allCookies.filter(
      (cookie) =>
        cookie.partitionKey &&
        JSON.stringify(cookie.partitionKey) === JSON.stringify(partitionKey)
    );
  }

  /**
   * Clears all cookies from the browser context.
   * @param context - The Playwright browser context
   */
  async clearCookies(context: BrowserContext): Promise<void> {
    await context.clearCookies();
  }

  /**
   * Clears cookies for a specific domain.
   * @param context - The Playwright browser context
   * @param domain - The domain to clear cookies for
   */
  async clearCookiesByDomain(
    context: BrowserContext,
    domain: string
  ): Promise<void> {
    await context.clearCookies({ domain });
  }

  /**
   * Adds a single cookie to the browser context.
   * Supports partitioned cookies with partitionKey.
   * @param context - The Playwright browser context
   * @param cookie - Cookie object to add
   */
  async addCookie(
    context: BrowserContext,
    cookie: {
      name: string;
      value: string;
      domain?: string;
      path?: string;
      expires?: number;
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: 'Strict' | 'Lax' | 'None';
      partitionKey?: string;
    }
  ): Promise<void> {
    await context.addCookies([cookie]);
  }

  /**
   * Gets a specific cookie by name.
   * @param context - The Playwright browser context
   * @param name - Cookie name
   * @param url - Optional URL to scope the cookie lookup
   * @returns Cookie object or undefined if not found
   */
  async getCookieByName(
    context: BrowserContext,
    name: string,
    url?: string
  ) {
    const cookies = await this.getCookies(context, url);
    return cookies.find((cookie) => cookie.name === name);
  }

  /**
   * Verifies if a cookie exists.
   * @param context - The Playwright browser context
   * @param name - Cookie name
   * @param url - Optional URL to scope the cookie lookup
   * @returns true if cookie exists, false otherwise
   */
  async hasCookie(
    context: BrowserContext,
    name: string,
    url?: string
  ): Promise<boolean> {
    const cookie = await this.getCookieByName(context, name, url);
    return cookie !== undefined;
  }

  /**
   * Updates an existing cookie or adds it if it doesn't exist.
   * @param context - The Playwright browser context
   * @param cookie - Cookie object to update/add
   */
  async updateCookie(
    context: BrowserContext,
    cookie: {
      name: string;
      value: string;
      domain?: string;
      path?: string;
      expires?: number;
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: 'Strict' | 'Lax' | 'None';
      partitionKey?: string;
    }
  ): Promise<void> {
    // Clear existing cookie with same name
    const existingCookies = await this.getCookies(context);
    const cookiesToKeep = existingCookies.filter((c) => c.name !== cookie.name);

    await context.clearCookies();
    await context.addCookies([...cookiesToKeep, cookie as any]);
  }

  /**
   * Exports cookies in Netscape format (compatible with curl, wget).
   * @param context - The Playwright browser context
   * @param filePath - Path to save the Netscape format file
   */
  async exportCookiesNetscapeFormat(
    context: BrowserContext,
    filePath: string
  ): Promise<void> {
    const cookies = await context.cookies();

    const netscapeLines = [
      '# Netscape HTTP Cookie File',
      '# This file was generated by Playwright',
      '',
    ];

    for (const cookie of cookies) {
      const line = [
        cookie.domain,
        cookie.domain.startsWith('.') ? 'TRUE' : 'FALSE',
        cookie.path || '/',
        cookie.secure ? 'TRUE' : 'FALSE',
        cookie.expires ? Math.floor(cookie.expires) : '0',
        cookie.name,
        cookie.value,
      ].join('\t');

      netscapeLines.push(line);
    }

    await fs.writeFile(filePath, netscapeLines.join('\n'), 'utf-8');
  }
}
