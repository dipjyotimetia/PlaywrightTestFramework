module.exports = {
  preset: "jest-playwright-preset",
  testMatch: ["**/__tests__/**/*.+(ts|js)", "**/?(*.)+(spec|test).+(ts|js)"],
  transform: {
    "^.+\\.(ts)$": "ts-jest",
  },
  testPathIgnorePatterns: ['/node_modules/'],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './test-results/',
        filename: 'report.html',
        expand: true
      }
    ]
  ],
  testEnvironmentOptions: {
    "jest-playwright": {
      browsers: ["chromium"], //, "firefox", "webkit"
      launchOptions: {
        headless: true,
      },
      serverOptions: {
        command: '',
        port: 3000,
        protocol: 'http',
        usedPortAction: 'kill',
        launchTimeout: 60000
      }
    },
  }
};