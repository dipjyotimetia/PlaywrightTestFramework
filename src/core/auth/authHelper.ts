import { AuthSetup, AuthConfig } from './authSetup';
import { TokenManager } from './tokenManager';

export class AuthHelper {
  private authSetup: AuthSetup;
  private tokenManager: TokenManager;
  private authConfig: AuthConfig | null = null;

  constructor() {
    this.authSetup = new AuthSetup();
    this.tokenManager = new TokenManager();
  }

  /**
   * Sets the authentication configuration for token refresh
   * @param config - Authentication configuration
   */
  setAuthConfig(config: AuthConfig): void {
    this.authConfig = config;
  }

  /**
   * Gets a valid token, refreshing if necessary
   * @returns Valid JWT token
   */
  async getValidToken(): Promise<string> {
    const tokenData = await this.tokenManager.loadToken();

    // If no token or expired, capture new one
    if (
      !tokenData ||
      this.tokenManager.isTokenExpired(tokenData)
    ) {
      console.log('Token expired or not found, capturing new token...');

      if (!this.authConfig) {
        throw new Error(
          'Auth config not set. Call setAuthConfig() before getting token.'
        );
      }

      const newTokenData = await this.authSetup.captureToken(this.authConfig);

      if (!newTokenData) {
        throw new Error('Failed to capture new token');
      }

      return newTokenData.token;
    }

    return tokenData.token;
  }

  /**
   * Forces token refresh by capturing a new token
   * @returns New token data
   */
  async refreshToken(): Promise<string> {
    if (!this.authConfig) {
      throw new Error(
        'Auth config not set. Call setAuthConfig() before refreshing token.'
      );
    }

    console.log('Forcing token refresh...');
    const newTokenData = await this.authSetup.captureToken(this.authConfig);

    if (!newTokenData) {
      throw new Error('Failed to refresh token');
    }

    return newTokenData.token;
  }

  /**
   * Clears the stored token
   */
  async clearToken(): Promise<void> {
    await this.tokenManager.clearToken();
  }
}

// Singleton instance for convenience
export const authHelper = new AuthHelper();
