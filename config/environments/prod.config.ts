/**
 * Production Environment Configuration
 */

export const prodConfig = {
  baseURL: process.env.PROD_BASE_URL || 'https://example.com',
  apiBaseURL: process.env.PROD_API_BASE_URL || 'https://api.example.com',
  timeout: 30000,
  retries: 2,
  workers: 1, // Conservative for production
  headless: true,
  slowMo: 0,
  screenshots: 'only-on-failure' as const,
  videos: 'retain-on-failure' as const,
  trace: 'retain-on-failure' as const,
};

export default prodConfig;
