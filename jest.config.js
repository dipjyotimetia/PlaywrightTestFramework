module.exports = {
    globalSetup: './setup.js',
    globalTeardown: './teardown.js',
    testEnvironment: './puppeteer_environment.js',
    testResultsProcessor: './node_modules/jest-allure-reporter',
    reporters: ["default", "jest-allure"],
};