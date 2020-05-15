import React from "react";
import { useForm, useSettersAsRefEventHandler } from "../src";

export default {
  title: "performanceTest"
}

const createArray = (length) => Array.from({ length }, (_, k) => k + 1);
const createKeys = (prefix, length = 1000) => createArray(length).map((_, i) => `${prefix}${i}`);

const emailKeys = createKeys("email");
export function Basic1000InputTest() {
  // @ts-expect-error
  // Create constraint settings for 1000 emails and a username input
  const constraints = React.useMemo(() => emailKeys.reduce((constraints, key) => {
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
  }));
  const { setValue, values, submit, errors, validateByName } = useForm({
    // @ts-expect-error
      constraints,
      onSubmit: values => {
        console.log(values);
      },
  })
  const changeRef = useSettersAsRefEventHandler<HTMLInputElement>(setValue, validateByName);
  return (
    <div>
      {JSON.stringify(values, null, 2)}
      <br/>
      {JSON.stringify(errors, null, 2)}
      <form onSubmit={submit}>
      <button type="submit">Submit</button>
      {emailKeys.map(key => (
        <input key={key} name={key} ref={changeRef} />
      ))}
       {errors.email && <div>{errors.email}</div>}
        <input
            name="username"
            ref={changeRef}
        />
        {errors.username && <div>{errors.username}</div>}
      </form>
    </div>
  );
}