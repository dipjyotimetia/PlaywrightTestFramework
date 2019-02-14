# MG | Test | UI Framework

## Versions / Dependencies

```
NVM:    v0.33.8       
Node:   10.13.0        
NPM:    6.4.0         
```

__Todo:__ Frontend Developers to review, teak and assess viability

__Note:__ No local evironment has been set up, so manual installation is nessasary at the moment.

## Getting up and running

```bash
# Pre: Ensure dependancies are installed

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
$ yarn run test src/test/addToBag.test.js

```

## Configuring for environments

The environment details are stored in the `config.json` file. To change environment, simply tweak this file to your needs. A specific product url is required.

## Tech Details

* Jest - Simple lightweight test runner that supports concurrency. https://facebook.github.io/jest/

* Puppeteer - A Node library which provides a high-level API to control headless Chrome or Chromium over the DevTools Protocol. It can also be configured to use full (non-headless) Chrome or Chromium.

## Project Structure

```bash
# All source code lives in here
./src/

# Test helpers used to abstract and DRY up code
./src/helpers/

# Page objects. These are used to store functions and behaviour shared by a particular page
./src/helepers/pages/

# Browser factory for setting up standard browser types
./src/helpers/browserFactory.js

# A helper for creating promises to analyze network requests
./src/helpers/requestHelper.js

# An example of a test without page objects and helpers
./src/helpers/proceduralExample

# Location of all test files
./src/test

# Config file for storing localised data configurations and credentials.
./config.json
```


{
  "name": "Puppeteer-ui-framework",
  "version": "3.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "jest --runInBand",
    "posttest": "allure generate",
    "CI": "jest --maxWorkers=2",
    "pretest": "npm install"
  },
  "author": "Dipjyoti Metia",
  "license": "ISC",
  "dependencies": {
    "allure-commandline": "2.9.0",
    "chai": "4.2.0",
    "chalk": "^2.4.2",
    "cross-env": "5.2.0",
    "eslint": "5.13.0",
    "faker": "^4.1.0",
    "jest": "^24.1.0",
    "jest-allure": "0.1.1",
    "jest-html-reporter": "^2.4.4",
    "jest-junit": "^6.2.1",
    "lodash": "4.17.11",
    "mkdirp": "0.5.1",
    "mocha": "5.2.0",
    "prettier": "^1.16.4",
    "puppeteer": "^1.11.0",
    "rimraf": "^2.6.3",
    "yaml": "1.3.2"
  },
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-preset-env": "^1.7.0",
    "jest-environment-node": "^24.0.0",
    "puppeteer-har": "^1.0.5",
    "puppeteer-to-istanbul": "^1.2.2"
  }
}
