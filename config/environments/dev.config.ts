/**
 * Development Environment Configuration
 */

export const devConfig = {
  baseURL: process.env.DEV_BASE_URL || 'http://localhost:3000',
  apiBaseURL: process.env.DEV_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 30000,
  retries: 0,
  workers: undefined, // Use all available cores
  headless: false, // Run in headed mode for dev
  slowMo: 50, // Slow down for better visibility
  screenshots: 'on' as const,
  videos: 'on' as const,
  trace: 'on' as const,
};

export default devConfig;
