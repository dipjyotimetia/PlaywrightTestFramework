import { createLogger, format, transports } from 'winston';

import { existsSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const filename = join(logDir, 'results.log');

export const logger = (caller: string) =>
  createLogger({
    level: env !== 'production' ? 'info' : 'debug',
    format: format.combine(
      format.label({ label: basename(caller) }),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
    ),
    transports: [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.printf(
            info =>
              `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
          )
        ),
      }),
      new transports.File({
        filename,
        format: format.combine(
          format.printf(
            info =>
              `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
          )
        ),
      }),
    ],
  });