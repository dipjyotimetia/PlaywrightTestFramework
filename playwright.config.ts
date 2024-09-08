import { defineConfig, devices } from '@playwright/test';
import type { GitHubActionOptions } from '@estruyf/github-actions-reporter';
import os from "node:os";

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
    [
      '@estruyf/github-actions-reporter',<GitHubActionOptions>
      {
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
          framework: "playwright",
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
        },
      },
    ],
  ],

  // use: {
  //   // Base URL to use in actions like `await page.goto('/')`.
  //   baseURL: 'http://127.0.0.1:3000',

  //   // Collect trace when retrying the failed test.
  //   trace: 'on-first-retry',
  // },
  // Configure projects for major browsers.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }, // Use Desktop Chrome device configuration
    },
  ],
});
