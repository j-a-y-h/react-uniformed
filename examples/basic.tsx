import React from 'react';
import {useForm, useSettersAsEventHandler} from "../src";

export default function Form() {
  const { submit, setValue, values } = useForm({
    onSubmit: data => alert(JSON.stringify(data))
  });
  const handleChange = useSettersAsEventHandler(setValue);
  return (
    <div className="App">
      <form onSubmit={submit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            name="name"
            placeholder="john"
            value={values.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            name="email"
            placeholder="example.com"
            value={values.email}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}