import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';

const logDir = path.join('/logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = createLogger({
  exitOnError: false,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.printf(({ level, message, stack, timestamp, ...meta }) => {
      let msgStr: string;
      if (typeof message === 'string') {
        msgStr = message;
      } else if (message === undefined) {
        msgStr = '';
      } else {
        try {
          msgStr = JSON.stringify(message);
        } catch {
          msgStr = '[Could not stringify message]';
        }
      }

      let metaStr = '';
      if (Object.keys(meta).length > 0) {
        try {
          metaStr = JSON.stringify(meta);
        } catch {
          metaStr = '[Could not stringify meta]';
        }
      }

      let stackStr = '';
      if (stack) {
        if (typeof stack === 'string') {
          stackStr = `\n${stack}`;
        } else {
          try {
            stackStr = `\n${JSON.stringify(stack)}`;
          } catch {
            stackStr = '\n[Could not stringify stack]';
          }
        }
      }

      return `[${String(timestamp)}] ${level}: ${msgStr}${metaStr}${stackStr}`;
    })
  ),
  level: 'debug',
  transports: [
    new transports.Console({ level: 'info' }),
    new transports.File({
      filename: path.join(logDir, 'app.log'),
      level: 'warn',
      maxFiles: 5,
      maxsize: 5 * 1024 * 1024,
      tailable: true,
    }),
  ],
});

export const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return 'Unknown error';
  }
};

export const formatValidationMessage = (msg: string): string => {
  const cleaned = msg.replace(/"/g, '').replace(/_/g, ' ');
  return `[${cleaned.charAt(0).toUpperCase() + cleaned.slice(1)}]`;
};

export default logger;
