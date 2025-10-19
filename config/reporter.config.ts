import {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestError,
  TestResult,
  TestStep,
} from '@playwright/test/reporter';
import { createLogger, format, transports } from 'winston';

import { existsSync, mkdirSync } from 'fs';

const logDir = 'logs';

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/info.log' }),
  ],
});

export default class MyReporter implements Reporter {
  /**
   * Logs the number of tests in the suite at the beginning of the test run.
   * @param config - The full configuration object.
   * @param suite - The test suite.
   */
  onBegin(config: FullConfig, suite: Suite): void {
    logger.info(`Starting the run with ${suite.allTests().length} tests`);
  }

  /**
   * Logs the start of each test case.
   * @param test - The test case.
   */
  onTestBegin(test: TestCase): void {
    logger.info(`Test Case Started: ${test.title}`);
  }

  /**
   * Logs the completion of each test case and its status.
   * @param test - The test case.
   * @param result - The test result.
   */
  onTestEnd(test: TestCase, result: TestResult): void {
    logger.info(`Test Case Completed: ${test.title} Status: ${result.status}`);
  }

  /**
   * Logs the execution of each test step if it belongs to the "test.step" category.
   * Enhanced with titlePath for full hierarchy (Playwright v1.55+).
   * @param test - The test case.
   * @param result - The test result.
   * @param step - The test step.
   */
  onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
    if (step.category === 'test.step') {
      // Use titlePath for full step hierarchy (v1.55+)
      let stepPath = step.title;
      if (step.titlePath) {
        const titlePath: any = step.titlePath;
        const pathArray = typeof titlePath === 'function' ? titlePath() : titlePath;
        stepPath = Array.isArray(pathArray) ? pathArray.join(' > ') : step.title;
      }
      logger.info(`Executing Step: ${step.title}`);
      logger.info(`Step Hierarchy: ${stepPath}`);
    }
  }

  /**
   * Logs the error message when an error occurs during the test execution.
   * @param error - The test error.
   */
  onError(error: TestError): void {
    logger.error(error.message);
  }
}
