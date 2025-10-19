/**
 * Staging Environment Configuration
 */

export const stagingConfig = {
  baseURL: process.env.STAGING_BASE_URL || 'https://staging.example.com',
  apiBaseURL: process.env.STAGING_API_BASE_URL || 'https://api-staging.example.com',
  timeout: 30000,
  retries: 1,
  workers: 2,
  headless: true,
  slowMo: 0,
  screenshots: 'only-on-failure' as const,
  videos: 'retain-on-failure' as const,
  trace: 'retain-on-failure' as const,
};

export default stagingConfig;
