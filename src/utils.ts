import { SyntheticEvent } from 'react';
import { ReactOrNativeEventListener } from './useSettersAsEventHandler';
import { FieldValue } from './useFields';

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

type MountEventHandlerArgs = Readonly<{
  event: string;
  eventHandler: ReactOrNativeEventListener;
  input: Pick<HTMLInputElement, 'addEventListener'> & Partial<Pick<HTMLInputElement, 'value'>>;
  mountedValue?: FieldValue;
}>;

/**
 * Mounts the specified event handler to the specified input. If mountedValue
 * is passed, then the value of the specified input is set to that as well.
 * @param input - TODO
 * @param event - TODO
 * @param eventHandler - TODO
 * @param mountedValue - TODO
 */
export function mountEventHandler({
  input,
  event,
  eventHandler,
  mountedValue,
}: MountEventHandlerArgs): void {
  // TODO: solve potential memory leak, in the else block removeEventListener,
  // and when this function
  // is called with new eventHandler
  input.addEventListener(event, eventHandler);
  // need to set the mounted values
  // eslint-disable-next-line no-param-reassign
  input.value = mountedValue ?? '';
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
