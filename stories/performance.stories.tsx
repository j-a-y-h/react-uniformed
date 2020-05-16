import React from "react";
import { useForm, useSettersAsRefEventHandler } from "../src";

export default {
  title: "performanceTest"
}

const createArray = (length) => Array.from({ length }, (_, k) => k + 1);
const createKeys = (prefix, length = 5000) => createArray(length).map((_, i) => `${prefix}${i}`);

const emailKeys = {
  1000: createKeys("email", 1000),
  5000: createKeys("email", 5000),
  10000: createKeys("email", 10000),
};

function Form({values, errors, submit, changeRef, emails}) {
  return (
    <div>
      <h1>Performance Test (Input Count: {emails.length})</h1>
      <br/>
      <table>
      <tr>
        <td style={{verticalAlign: "top", width: "25%"}}>
            <form onSubmit={submit}>
            <button type="submit">Submit</button>
            <br />
            {emails.map(key => (
              <input key={key} name={key} ref={changeRef} />
            ))}
            {errors.email && <div>{errors.email}</div>}
            <input name="username" ref={changeRef} />
            {errors.username && <div>{errors.username}</div>}
          </form>
        </td>
        <td style={{verticalAlign: "top", width: "25%"}}>
          <p>Errors</p>
          <pre>{JSON.stringify(errors, null, 2)}</pre>
        </td>
        <td style={{verticalAlign: "top", width: "25%"}}>
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
        return {...cur, [key]: {type: 'email', required: true, pattern: [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'invalid email']}}
      }, {})
    },
    onSubmit: data => alert(JSON.stringify(data)),
  });
  const handleChange = useSettersAsRefEventHandler<HTMLInputElement>(setValue, validateByName);

  return <Form emails={emailKeys[1000]} changeRef={handleChange} values={values} errors={errors} submit={submit} />
}

export function Basic5000InputTest() {
  const { setValue, values, submit, errors } = useForm({
      onSubmit: values => {
        console.log(values);
      },
  })
  const rafSetValue = React.useCallback((...args) => {
    // @ts-expect-error
    requestAnimationFrame(() => setValue(...args));
  }, [setValue]);
  const changeRef = useSettersAsRefEventHandler<HTMLInputElement>(rafSetValue);
  return <Form emails={emailKeys[5000]} changeRef={changeRef} values={values} errors={errors} submit={submit} />
}

export function Basic10000InputTest() {
  const { setValue, values, submit, errors } = useForm({
      onSubmit: values => {
        console.log(values);
      },
  })
  const rafSetValue = React.useCallback((...args) => {
    // @ts-expect-error
    requestAnimationFrame(() => setValue(...args));
  }, [setValue]);
  const changeRef = useSettersAsRefEventHandler<HTMLInputElement>(rafSetValue);
  return <Form emails={emailKeys[10000]} changeRef={changeRef} values={values} errors={errors} submit={submit} />
}
