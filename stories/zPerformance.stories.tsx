import React from 'react';
import { useForm, useSettersAsRefEventHandler } from '../src';

export default {
  title: 'Performance',
};

const createArray = (length) => Array.from({ length }, (_, k) => k + 1);
const createKeys = (prefix, length = 5000) => createArray(length).map((_, i) => `${prefix}${i}`);

const emailKeys = {
  100: createKeys('email', 100),
  1000: createKeys('email', 1000),
};

function Form({ values, errors, submit, changeRef, emails }) {
  return (
    <div>
      <h1>Performance Test (Input Count: {emails.length})</h1>
      <br />
      <table>
        <tr>
          <td style={{ verticalAlign: 'top', width: '25%' }}>
            <form onSubmit={submit}>
              <button type='submit'>Submit</button>
              <br />
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
            </form>
          </td>
          <td style={{ verticalAlign: 'top', width: '25%' }}>
            <p>Errors</p>
            <pre>{JSON.stringify(errors, null, 2)}</pre>
          </td>
          <td style={{ verticalAlign: 'top', width: '25%' }}>
            <p>Values</p>
            <pre>{JSON.stringify(values, null, 2)}</pre>
          </td>
        </tr>
      </table>
    </div>
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
