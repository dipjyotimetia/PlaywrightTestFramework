module.exports = {
  preset: 'jest-puppeteer',
  setupFilesAfterEnv: ['jest-allure/dist/setup', 'expect-puppeteer'],
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
