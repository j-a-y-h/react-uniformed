import React from "react";
import { useForm, useSettersAsRefEventHandler } from "../src";

export default {
  title: "performance"
}

export function VeryBigFormWithValidation() {
  const { setValue, submit, errors, validateByName } = useForm({
    constraints: (values) => {
      return Object.keys(values).reduce((cur, key) => {
        return {...cur, [key]: {type: 'email', required: true}}
      }, {})
    },
    onSubmit: data => alert(JSON.stringify(data)),
  });
  const handleChange = useSettersAsRefEventHandler<HTMLInputElement>(setValue, validateByName);
  return (
    <form onSubmit={submit}>
      {Object.keys(errors).map(e => (
        <p style={{ color: "red" }}>{errors[e]}</p>
      ))}
      {new Array(1000).fill(undefined).map((_, i) => i).map((i) => {
        return (<div key={i}>
          <label>Email {i}</label>
          <input name={`email${i}`} ref={handleChange} type="text" />
        </div>)
      })}
      <input type="submit" />
    </form>
  );
}

let renderCount = 0;
export function RenderCount() {
  renderCount++;
  const { setValue, submit } = useForm({
    onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
  });
  const handleChange = useSettersAsRefEventHandler<HTMLInputElement>(setValue);
  return (
    <form onSubmit={submit}>
      <div>Render Count: {renderCount}</div>
      <div>
        <label>Name </label>
        <input
          type="text"
          name="name"
          ref={handleChange}
        />
      </div>
      <input type="submit" />
    </form>
  );
}
