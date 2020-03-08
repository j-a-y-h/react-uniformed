import React from "react";
import { useForm, useSettersAsEventHandler } from "../src";

export default {
    title: "useForm"
}

export function Basic() {
  const { setValue, validateByName, values, submit } = useForm({
    onSubmit: data => alert(JSON.stringify(data)),
  });
  const handleChange = useSettersAsEventHandler(setValue, validateByName);
  console.log(JSON.stringify(values, null, 2));
  return (
    <form onSubmit={submit}>
      <div>
        <label>Name </label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="text"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
      </div>
      <input type="submit" />
    </form>
  );
}

export function SubmissionFails() {
    const { setValue, validateByName, values, submit } = useForm({
        onSubmit(data) {
            throw "Unexpected error occured";
            alert(JSON.stringify(data));
        },
    });
    const handleChange = useSettersAsEventHandler(setValue, validateByName);
    console.log(JSON.stringify(values, null, 2));
    return (
      <form onSubmit={submit}>
        <div>
          <label>Name </label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
        </div>
        <input type="submit" />
      </form>
    );
  }
