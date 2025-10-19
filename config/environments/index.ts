/**
 * Environment Configuration Selector
 *
 * Usage:
 *   import { getEnvironmentConfig } from './config/environments';
 *   const config = getEnvironmentConfig();
 */

import devConfig from './dev.config';
import stagingConfig from './staging.config';
import prodConfig from './prod.config';

export type Environment = 'dev' | 'staging' | 'prod';

export interface EnvironmentConfig {
  baseURL: string;
  apiBaseURL: string;
  timeout: number;
  retries: number;
  workers: number | undefined;
  headless: boolean;
  slowMo: number;
  screenshots: 'on' | 'off' | 'only-on-failure';
  videos: 'on' | 'off' | 'retain-on-failure';
  trace: 'on' | 'off' | 'retain-on-failure';
}

const configs: Record<Environment, EnvironmentConfig> = {
  dev: devConfig,
  staging: stagingConfig,
  prod: prodConfig,
};

/**
 * Get configuration for current environment
 * Set environment via ENV variable: ENV=staging npm test
 */
export function getEnvironmentConfig(env?: Environment): EnvironmentConfig {
  const environment = (env || process.env.ENV || 'dev') as Environment;

  if (!configs[environment]) {
    console.warn(`Unknown environment: ${environment}, falling back to dev`);
    return configs.dev;
  }

  return configs[environment];
}

export { devConfig, stagingConfig, prodConfig };
export default getEnvironmentConfig;
