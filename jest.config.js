module.exports = {
  globalSetup: './setup.js',
  globalTeardown: './teardown.js',
  testEnvironment: './puppeteer_environment.js',
  setupFilesAfterEnv: ['jest-allure/dist/setup'],
  reporters: [
    'default',
    'jest-allure',
    ['jest-junit', { suiteName: 'E2E tests', outputDirectory: './reports/' }],
  ],
};
