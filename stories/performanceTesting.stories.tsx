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
};

function Form({values, errors, submit, changeRef, emails}) {
  return (
    <div>
      <h1>Performance Test (Input Count: {emails.length})</h1>
      <br/>
      {JSON.stringify(errors, null, 2)}
      <table>
      <tr>
        <td>
            <form onSubmit={async (e) => {
              const { target } = e;
              await submit(e);
              (target as HTMLFormElement).reset();
            }}>
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
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </td>
      </tr>
      </table>
    </div>
  );
}
export function Basic1000InputTestWithValidationOnChange() {
  // Create constraint settings for 1000 emails and a username input
  const constraints = React.useMemo(() => emailKeys[1000].reduce((constraints, key) => {
    constraints[key] = {
      required: false,//"This is required",
      pattern: [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'invalid email'],
    };
    return constraints;
  }, {
    username: value => {
      console.log("Validated-------");
      return (value === 'admin' ? true : 'Nice try!')
    },
  }), []);
  const { setValue, values, submit, errors, validateByName } = useForm({
    // @ts-expect-error
      constraints,
      onSubmit: values => {
        console.log(values);
      },
  })
  const changeRef = useSettersAsRefEventHandler<HTMLInputElement>(setValue, validateByName);
  return <Form emails={emailKeys[1000]} changeRef={changeRef} values={values} errors={errors} submit={submit} />
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