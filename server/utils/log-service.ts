import * as logger from 'heroku-logger';

export interface LoggerInterface {
  info: (message: string, params?: any) => void;
  trace: (message: string, params?: any) => void;
  debug: (message: string, params?: any) => void;
  warn: (message: string, params?: any) => void;
  fatal: (message: string, params?: any) => void;
  error: (message: string, params?: any) => void;
}

export function getLogger(fileName: string): LoggerInterface {
  return logger.clone({ prefix: fileName });
}
