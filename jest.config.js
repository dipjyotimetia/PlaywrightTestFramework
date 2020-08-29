module.exports = {
  // preset: ['jest-puppeteer', 'jest-playwright-preset'],
  preset: 'jest-playwright-preset',
  reporters: [
    'default',
    'jest-allure',
    ['jest-junit', { suiteName: 'E2E tests', outputDirectory: './reports/' }],
    [
      'jest-html-reporters',
      {
        publicPath: './reports/',
        filename: 'report.html',
        expand: false,
      },
    ],
  ],
};
