import React, { useState } from 'react';
import { useSubmission } from '../src';

export default {
  title: 'useSubmission',
};

const sleep = (duration: number) => {
  return new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, duration * 1000);
  });
};

export function Form() {
  const [hasErrors, setHasErrors] = useState(false);
  const { isSubmitting, submitCount, submit } = useSubmission({
    onSubmit: () => {
      console.log('called');
      return sleep(1);
    },
    disabled: hasErrors,
    validator() {
      const isValid = Boolean(Math.floor(Math.random() * 2));
      setHasErrors(isValid);
    },
  });
  return (
    <form onSubmit={submit}>
      {isSubmitting && <p>Is Submitting...</p>}
      {hasErrors && <p>There is a random error.</p>}
      <div>
        <label>Name </label>
        <input type='text' name='name' value='John' />
      </div>
      <input disabled={isSubmitting} type='submit' />
      <div>
        <label>Submit count: {submitCount}</label>
      </div>
    </form>
  );
}

export function FormWithRandomValidation() {
  const [hasErrors, setHasErrors] = useState(false);
  const [clicks, setClicks] = useState(0);
  const { submitCount, isSubmitting, submit } = useSubmission({
    onSubmit: () => {
      console.log('called');
      return sleep(0.5);
    },
    disabled: hasErrors,
    validator() {
      const isValid = Boolean(Math.floor(Math.random() * 2));
      setHasErrors(isValid);
    },
  });
  return (
    <form
      onSubmit={(e) => {
        setClicks((i) => i + 1);
        submit(e);
      }}>
      <div>
        <label>Name </label>
        <input type='text' name='name' value='John' disabled={hasErrors} />
      </div>
      <input disabled={isSubmitting} type='submit' />
      <div>
        <label>
          Submit count / submit attempts: {submitCount}/{clicks}
        </label>
        <br />
        <label>Has Errors: {JSON.stringify(hasErrors)}</label>
      </div>
    </form>
  );
}

export function FormWithAsyncValidator() {
  const [hasErrors, setHasErrors] = useState(false);
  const [clicks, setClicks] = useState(0);
  const { submitCount, isSubmitting, submit } = useSubmission({
    onSubmit: () => {
      console.log('called');
    },
    disabled: hasErrors,
    validator() {
      console.log('validating');
      return sleep(5).then(() => {
        console.log('done validating');
        setHasErrors((i) => !i);
      });
    },
  });
  return (
    <form
      onSubmit={(e) => {
        setClicks((i) => i + 1);
        submit(e);
      }}>
      <div>
        <label>Name </label>
        <input type='text' name='name' value='John' disabled={hasErrors} />
      </div>
      <input disabled={isSubmitting} type='submit' />
      <div>
        <label>
          Submit count / submit attempts: {submitCount}/{clicks}
        </label>
        <br />
        <label>Has Errors: {JSON.stringify(hasErrors)}</label>
      </div>
    </form>
  );
}
