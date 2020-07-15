import React from 'react';
import { useForm, useSettersAsRefEventHandler } from '../src';
import { ValuesErrorsTable } from './utils';

export default {
  title: 'Performance',
};

const createArray = (length) => Array.from({ length }, (_, k) => k + 1);
const createKeys = (prefix, length = 5000) => createArray(length).map((_, i) => `${prefix}${i}`);

const emailKeys = {
  100: createKeys('email', 100),
  1000: createKeys('email', 1000),
};

function FormHeader({ children, errors, values, emails, ...props }) {
  return (
    <div>
      <h1>Performance Test (Input Count: {emails.length})</h1>
      <br />
      <ValuesErrorsTable values={values} errors={errors}>
        <form {...props}>
          <button type='submit'>Submit</button>
          <br />
          {children}
        </form>
      </ValuesErrorsTable>
    </div>
  );
}

function Form({ values, errors, submit, changeRef, emails }) {
  return (
    <FormHeader emails={emails} errors={errors} values={values} onSubmit={submit}>
      {emails.map((key) => (
        <React.Fragment key={key}>
          <label>{key}:</label>
          <input name={key} ref={changeRef} />
          <span style={{ color: 'red' }}>{errors[key] && <div>{errors[key]}</div>}</span>
          <br />
        </React.Fragment>
      ))}
      <input name='username' ref={changeRef} />
      {errors.username && <div>{errors.username}</div>}
    </FormHeader>
  );
}

export function BigFormWithValidation() {
  const { setValue, submit, errors, values, validateByName } = useForm({
    constraints: (values) => {
      return Object.keys(values).reduce((cur, key) => {
        return { ...cur, [key]: { type: ['email', 'Please enter a valid email'], required: true } };
      }, {});
    },
    onSubmit: (data) => alert(JSON.stringify(data)),
  });
  const handleChange = useSettersAsRefEventHandler<HTMLInputElement>(setValue, validateByName);

  return (
    <Form
      emails={emailKeys[100]}
      changeRef={handleChange}
      values={values}
      errors={errors}
      submit={submit}
    />
  );
}

export function BigFormWith1000Inputs() {
  const { setValue, submit, errors, values, validateByName } = useForm({
    constraints: (values) => {
      return Object.keys(values).reduce((cur, key) => {
        return { ...cur, [key]: { type: ['email', 'Please enter a valid email'], required: true } };
      }, {});
    },
    onSubmit: (data) => alert(JSON.stringify(data)),
  });
  const handleChange = useSettersAsRefEventHandler<HTMLInputElement>(setValue, validateByName);

  return (
    <Form
      emails={emailKeys[1000]}
      changeRef={handleChange}
      values={values}
      errors={errors}
      submit={submit}
    />
  );
}
