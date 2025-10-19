import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { TokenManager, TokenData } from './tokenManager';

export interface AuthConfig {
  loginUrl: string;
  usernameSelector: string;
  passwordSelector: string;
  submitSelector: string;
  username: string;
  password: string;
  tokenLocation: 'localStorage' | 'sessionStorage' | 'cookie' | 'header';
  tokenKey?: string;
  headless?: boolean;
  expectedUrlAfterLogin?: string;
}

export class AuthSetup {
  private tokenManager: TokenManager;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  constructor() {
    this.tokenManager = new TokenManager();
  }

  /**
   * Captures JWT token via browser automation
   * @param config - Authentication configuration
   * @returns Token data
   */
  async captureToken(config: AuthConfig): Promise<TokenData | null> {
    try {
      // Launch browser
      this.browser = await chromium.launch({
        headless: config.headless ?? false,
      });

      this.context = await this.browser.newContext({
        ignoreHTTPSErrors: true,
      });

      this.page = await this.context.newPage();

      // Set up response listener to capture token from headers
      let capturedToken: string | null = null;

      this.page.on('response', async (response) => {
        if (config.tokenLocation === 'header') {
          const authHeader =
            response.headers()['authorization'] ||
            response.headers()['Authorization'];

          if (authHeader) {
            if (authHeader.startsWith('Bearer ')) {
              capturedToken = authHeader.substring(7);
            } else if (authHeader.startsWith('token ')) {
              capturedToken = authHeader.substring(6);
            } else {
              capturedToken = authHeader;
            }
          }

          // Also check for token in response body for login endpoints
          if (
            response.url().includes('login') ||
            response.url().includes('auth')
          ) {
            try {
              const body = await response.json();
              if (body.token) {
                capturedToken = body.token;
              } else if (body.access_token) {
                capturedToken = body.access_token;
              } else if (body.data && body.data.token) {
                capturedToken = body.data.token;
              }
            } catch (e) {
              // Response might not be JSON
            }
          }
        }
      });

      // Navigate to login page
      await this.page.goto(config.loginUrl, { waitUntil: 'networkidle' });

      // Fill in credentials
      await this.page.fill(config.usernameSelector, config.username);
      await this.page.fill(config.passwordSelector, config.password);

      // Click submit
      await this.page.click(config.submitSelector);

      // Wait for navigation or expected URL
      if (config.expectedUrlAfterLogin) {
        await this.page.waitForURL(config.expectedUrlAfterLogin, {
          timeout: 30000,
        });
      } else {
        await this.page.waitForLoadState('networkidle');
      }

      // Give extra time for tokens to be set
      await this.page.waitForTimeout(2000);

      let token: string | null = null;

      // Extract token based on location
      switch (config.tokenLocation) {
        case 'localStorage':
          token = await this.page.evaluate((key) => {
            return localStorage.getItem(key || 'token');
          }, config.tokenKey);
          break;

        case 'sessionStorage':
          token = await this.page.evaluate((key) => {
            return sessionStorage.getItem(key || 'token');
          }, config.tokenKey);
          break;

        case 'cookie':
          const cookies = await this.context.cookies();
          const tokenCookie = cookies.find(
            (c) => c.name === (config.tokenKey || 'token')
          );
          token = tokenCookie?.value || null;
          break;

        case 'header':
          token = capturedToken;
          break;
      }

      if (!token) {
        throw new Error('Failed to capture token');
      }

      const tokenData: TokenData = {
        token,
        tokenType: 'Bearer',
        capturedAt: Date.now(),
        expiresAt: TokenManager.decodeTokenExpiry(token),
        environment: process.env.NODE_ENV || 'development',
      };

      // Save token
      await this.tokenManager.saveToken(tokenData);

      console.log('Token captured and saved successfully');

      return tokenData;
    } catch (error) {
      console.error('Error capturing token:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Captures token from network request/response
   * @param config - Authentication configuration
   * @param requestMatcher - Function to match the request that contains the token
   * @returns Token data
   */
  async captureTokenFromRequest(
    config: AuthConfig,
    requestMatcher: (url: string) => boolean
  ): Promise<TokenData | null> {
    try {
      this.browser = await chromium.launch({
        headless: config.headless ?? false,
      });

      this.context = await this.browser.newContext({
        ignoreHTTPSErrors: true,
      });

      this.page = await this.context.newPage();

      let capturedToken: string | null = null;

      // Intercept requests
      await this.page.route('**/*', async (route) => {
        const request = route.request();

        if (requestMatcher(request.url())) {
          const authHeader = request.headers()['authorization'];
          if (authHeader) {
            if (authHeader.startsWith('Bearer ')) {
              capturedToken = authHeader.substring(7);
            } else if (authHeader.startsWith('token ')) {
              capturedToken = authHeader.substring(6);
            }
          }
        }

        await route.continue();
      });

      // Navigate and login
      await this.page.goto(config.loginUrl, { waitUntil: 'networkidle' });
      await this.page.fill(config.usernameSelector, config.username);
      await this.page.fill(config.passwordSelector, config.password);
      await this.page.click(config.submitSelector);

      if (config.expectedUrlAfterLogin) {
        await this.page.waitForURL(config.expectedUrlAfterLogin, {
          timeout: 30000,
        });
      } else {
        await this.page.waitForLoadState('networkidle');
      }

      await this.page.waitForTimeout(2000);

      if (!capturedToken) {
        throw new Error('Failed to capture token from request');
      }

      const tokenData: TokenData = {
        token: capturedToken,
        tokenType: 'Bearer',
        capturedAt: Date.now(),
        expiresAt: TokenManager.decodeTokenExpiry(capturedToken),
        environment: process.env.NODE_ENV || 'development',
      };

      await this.tokenManager.saveToken(tokenData);

      console.log('Token captured from request and saved successfully');

      return tokenData;
    } catch (error) {
      console.error('Error capturing token from request:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Cleanup browser resources
   */
  private async cleanup(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}
