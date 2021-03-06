import { SyntheticEvent } from 'react';
import { ErrorHandler } from '../useErrors';
import { Fields } from '../useFields';

type onSubmitModifiers = Readonly<{
  setError: ErrorHandler<string>;
  setFeedback: (feedback: string) => void;
  event?: SyntheticEvent;
}>;

export interface SubmissionHandler {
  (values: Fields, api: onSubmitModifiers): void | never | Promise<void | never>;
}
export interface SubmitHandler {
  (event?: SyntheticEvent): void;
}
export interface UseSubmissionProps {
  readonly onSubmit: SubmissionHandler;
  validator?(): Promise<void> | void;
  /**
   * Determines if submission should be disabled. Generally,
   * you want to disable if there are errors.
   */
  readonly disabled?: boolean;
  reset?(event?: SyntheticEvent): void;
  setError?(name: string, error: string): void;
  readonly values?: Fields;
}

export interface UseSubmissionHook {
  readonly isSubmitting: boolean;
  readonly submitCount: number;
  readonly submit: SubmitHandler;
  readonly submitFeedback: SubmitFeedback;
}

export interface UseHandleSubmitProps {
  readonly values: Fields;
  readonly onSubmit: SubmissionHandler;
  reset?(event?: SyntheticEvent): void;
  setError?(name: string, error: string): void;
  setSubmitEvent(event?: SyntheticEvent): void;
}

export interface UseHandleSubmit {
  readonly isSubmitting: boolean;
  readonly submitCount: number;
  readonly handleSubmit: SubmitHandler;
  readonly submitFeedback: SubmitFeedback;
}

export interface UseSubmitProps {
  readonly submitEvent: React.MutableRefObject<SyntheticEvent<Element, Event> | undefined>;
  readonly disabled: boolean;
  readonly handleSubmit: SubmitHandler;
  validator?(): Promise<void> | void;
  setSubmitEvent(event?: SyntheticEvent): void;
}

export type UseSubmit = SubmitHandler;

export enum ActionTypes {
  error,
  feedback,
  reset,
}
export interface Action {
  readonly type: ActionTypes;
  readonly payload?: string;
}
export type SubmitFeedback = Readonly<{
  error?: string;
  message?: string;
}>;
