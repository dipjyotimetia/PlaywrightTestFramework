import { Reporter, FullConfig, Suite, TestCase, TestError, TestResult, TestStep } from "@playwright/test/reporter";
import { createLogger, format, transports } from 'winston';

import { existsSync, mkdirSync } from 'fs';

const logDir = 'logs';

if (!existsSync(logDir)) {
    mkdirSync(logDir);
}

const consoleTransport = new transports.Console();
const fileTransport = new transports.File({ filename: 'logs/info.log', level: 'info' });

const logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: [
        // Write all logs with importance level of `info` or less than it to console
        consoleTransport,
        // Write all logs with importance level of `info` to a log file
        fileTransport,
    ],
});

export default class MyReporter implements Reporter {

    onBegin(config: FullConfig, suite: Suite) {
        logger.info(`Starting the run with ${suite.allTests().length} tests`);
    }

    onTestBegin(test: TestCase): void {
        logger.info(`Test Case Started : ${test.title}`);
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        logger.info(`Test Case Completed : ${test.title} Status : ${result.status}`);
    }

    onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
        if (step.category === `test.step`) {
            logger.info(`Executing Step : ${step.title}`);
        }
    }

    onError(error: TestError): void {
        logger.error(error.message);
    }
}
