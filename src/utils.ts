import { SyntheticEvent } from 'react';

const projectName = 'react-uniformed';

export enum LoggingTypes {
  invalidArgument = 'InvalidArgument',
  typeError = 'TypeError',
  constraintError = 'ConstraintError',
}
interface Logger {
  (message?: string, ...optionalParams: string[]): void;
}

export function resetForm(event?: SyntheticEvent): void {
  if (event?.target instanceof HTMLElement) {
    event.target.closest('form')?.reset();
  }
}

/* eslint-disable no-console */
/**
 * Safely catches errors from promises and allows functions to continue returning void
 * @param promise - specified promise
 */
export function safePromise(promise: void | Promise<void>): void {
  if (promise instanceof Promise) {
    promise.catch(console.error);
  }
}

function assertion(condition: boolean, type: LoggingTypes, message: string, logger: Logger): void {
  if (!condition) {
    logger(`${projectName}: [${type}] ${message}`);
  }
}

export const assert = {
  error(condition: boolean, type: LoggingTypes, message: string): void {
    assertion(condition, type, message, (...msg) => console.error(...msg));
  },
  warning(condition: boolean, type: LoggingTypes, message: string): void {
    assertion(condition, type, message, (...msg) => console.warn(...msg));
  },
};
