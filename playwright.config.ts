import { defineConfig, devices } from '@playwright/test';
import type { GitHubActionOptions } from '@estruyf/github-actions-reporter';
import os from 'node:os';

const isCI = !!process.env.CI;

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'src/tests',
  // Run all tests in parallel.
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,
  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,
  // Reporter configuration
  reporter: [
    ['html', 'line'], // HTML and Line reporters
    ['./reportConfig.ts'], // Custom reporter configuration file
    ['blob', { outputFile: `./blob-report/report-${os.platform()}.zip` }],
    ['json', { outputFile: 'results.json' }],
    [
      '@estruyf/github-actions-reporter',
      <GitHubActionOptions>{
        title: 'Playwright Tests',
        useDetails: true,
        showError: true,
        showAnnotations: true,
      },
    ], // GitHub Actions reporter
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: true,
        environmentInfo: {
          Browser: process.env.BROWSER,
          framework: 'playwright',
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
        },
      },
    ],
  ],
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          headless: isCI,
          slowMo: 50,
        },
        contextOptions: {
          viewport: { width: 1280, height: 720 },
          ignoreHTTPSErrors: true,
        },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: {
          headless: isCI,
          slowMo: 50,
        },
        contextOptions: {
          viewport: { width: 1280, height: 720 },
          ignoreHTTPSErrors: true,
        },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        launchOptions: {
          headless: isCI,
          slowMo: 50,
        },
        contextOptions: {
          viewport: { width: 1280, height: 720 },
          ignoreHTTPSErrors: true,
        },
      },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 15 Pro'] },
    },
  ],

  timeout: 60000,
  expect: {
    timeout: 5000,
  },
  use: {
    actionTimeout: 0,
    navigationTimeout: 30000,
    trace: 'on-first-retry',
  },
});
