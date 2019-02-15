const chalk = require('chalk');
const puppeteer = require('puppeteer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const os = require('os');
const path = require('path');
const rimraf = require('rimraf');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');
const allureReport = path.resolve(path.join(process.cwd(), `./allure-report`));
const allureResult = path.resolve(path.join(process.cwd(), `./allure-results`));

module.exports = async function() {
  console.log(chalk.green('Setup Puppeteer'));
  const browser = await puppeteer.launch({});
  global.__BROWSER__ = browser;
  mkdirp.sync(DIR);
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
  rimraf(allureReport, () => {
    console.log(chalk`\n{green Deleting previous allure-reports}`);
  });
  rimraf(allureResult, () => {
    console.log(chalk`\n{green Deleting previous allure-results}`);
  });
};