# Puppeteer | AutomationTest | UI Framework

[![Build Status](https://github.com/TestautoDev/PuppeteerTestFramework/workflows/PuppeteerCI/badge.svg)](https://github.com/TestautoDev/PuppeteerTestFramework/actions)

[![express logo](https://user-images.githubusercontent.com/10379601/29446482-04f7036a-841f-11e7-9872-91d1fc2ea683.png)](https://www.npmjs.com/package/puppeteer)

## Versions / Dependencies

```
Puppeteer : 1.19
Node:       12.10.0
NPM:        6.10.0
```

**Note:** No local environment has been set up, so manual installation is necessary at the moment.

## Getting up and running

```bash
# Pre: Ensure dependencies are installed

# 1: Create new folder in desired location and move into it

# 2: Clone the repo
$ git clone

# 3: Install dependencies
$ npm install
```

## Commands

```bash
# executes all tests with the format .test.js
$ npm run test

# executes specific test file
$ yarn run test src/test/***.test.js

```

## Configuring for environments

The environment details are stored in the `config.json` file. To change environment, simply tweak this file to your needs. A specific product url is required.

## Tech Details

- Jest - Simple lightweight test runner that supports concurrency. https://facebook.github.io/jest/

- Puppeteer - A Node library which provides a high-level API to control headless Chrome or Chromium over the DevTools Protocol. It can also be configured to use full (non-headless) Chrome or Chromium.

## Project Structure

```bash
# All source code lives in here
./src/
# Test helpers used to abstract and DRY up code
./src/helpers/
# Page objects. These are used to store functions and behaviour shared by a particular page
./src/helepers/pages/
# Browser factory for setting up standard browser types
./src/helpers/BrowserFactory.js
# A helper for creating promises to analyze network requests
./src/helpers/RequestHelper.js
# An example of mock response
./src/mock
# Location of all test files
./src/test
# Config file for storing localized data configurations and credentials.
./config.json
```

## NPM Script

```json
"scripts": {
    "test:env": "cross-env NODE_ENV=beteasy.com.au jest --runInBand"
    "test": "jest --runInBand",
    "posttest": "allure generate",
    "CI": "jest --maxWorkers=2",
    "pretest": "npm install",
    "lint": "eslint **\\*.js",
    "precommit": "npm run lint",
    "prepush": "npm run lint"
  },
```

[Jest](https://github.com/facebook/jest/blob/master/README.md)

[Puppeteer](https://github.com/GoogleChrome/puppeteer/blob/master/README.md)

[Sinon](https://github.com/sinonjs/sinon/blob/master/README.md)

[Axios](https://github.com/axios/axios/blob/master/README.md)

This patch allows passing 0 to disable timeout for the following methods:

```javascript
await page.goto(`http://www.goole.com.au`, { timeout: 0 });
await page.waitForSelector(`a[href='/join-now']`, { visible: true });
```

- page.goto
- page.waitForNavigation
- page.goForward
- page.goBack

### Docker container run

```bash
docker run --privileged puppeteertestframework:latest
```

### More Examples

`https://github.com/checkly/puppeteer-examples`
