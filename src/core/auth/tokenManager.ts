import * as fs from 'fs';
import * as path from 'path';

export interface TokenData {
  token: string;
  tokenType: string;
  expiresAt?: number;
  refreshToken?: string;
  capturedAt: number;
  environment?: string;
}

export class TokenManager {
  private tokenDir: string;
  private tokenFile: string;

  constructor(tokenDir = '.auth', tokenFile = 'tokens.json') {
    this.tokenDir = path.resolve(process.cwd(), tokenDir);
    this.tokenFile = path.join(this.tokenDir, tokenFile);
  }

  /**
   * Ensures the token directory exists
   */
  private ensureTokenDirectory(): void {
    if (!fs.existsSync(this.tokenDir)) {
      fs.mkdirSync(this.tokenDir, { recursive: true });
    }
  }

  /**
   * Saves JWT token and metadata to local file
   * @param tokenData - Token data to save
   */
  async saveToken(tokenData: TokenData): Promise<void> {
    this.ensureTokenDirectory();

    const data = {
      ...tokenData,
      capturedAt: Date.now(),
    };

    fs.writeFileSync(this.tokenFile, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Token saved successfully to ${this.tokenFile}`);
  }

  /**
   * Loads token from local storage
   * @returns Token data or null if not found
   */
  async loadToken(): Promise<TokenData | null> {
    if (!fs.existsSync(this.tokenFile)) {
      console.log('No token file found');
      return null;
    }

    try {
      const content = fs.readFileSync(this.tokenFile, 'utf-8');
      const tokenData: TokenData = JSON.parse(content);
      return tokenData;
    } catch (error) {
      console.error('Error loading token:', error);
      return null;
    }
  }

  /**
   * Checks if token is expired
   * @param tokenData - Token data to check
   * @returns true if token is expired or about to expire (within 5 minutes)
   */
  isTokenExpired(tokenData: TokenData | null): boolean {
    if (!tokenData || !tokenData.expiresAt) {
      return true;
    }

    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
    return Date.now() >= tokenData.expiresAt - bufferTime;
  }

  /**
   * Gets valid token, returns null if expired or not found
   * @returns Token string or null
   */
  async getValidToken(): Promise<string | null> {
    const tokenData = await this.loadToken();

    if (!tokenData) {
      return null;
    }

    if (this.isTokenExpired(tokenData)) {
      console.log('Token is expired');
      return null;
    }

    return tokenData.token;
  }

  /**
   * Clears stored token
   */
  async clearToken(): Promise<void> {
    if (fs.existsSync(this.tokenFile)) {
      fs.unlinkSync(this.tokenFile);
      console.log('Token cleared successfully');
    }
  }

  /**
   * Decodes JWT token to extract expiry time
   * @param token - JWT token string
   * @returns Expiry timestamp in milliseconds
   */
  static decodeTokenExpiry(token: string): number | undefined {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return undefined;
      }

      const payload = JSON.parse(
        Buffer.from(parts[1], 'base64').toString('utf-8')
      );

      if (payload.exp) {
        return payload.exp * 1000; // Convert to milliseconds
      }

      return undefined;
    } catch (error) {
      console.error('Error decoding token:', error);
      return undefined;
    }
  }
}
