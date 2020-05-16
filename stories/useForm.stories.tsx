import React from "react";
import { useForm, useSettersAsEventHandler } from "../src";

export default {
    title: "useForm"
}
const sleep = (duration: number) => {
  return new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, duration * 1000);
  });
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
    const { setValue, isSubmitting, values, submit, submitFeedback } = useForm({
      onSubmit(data) {
        return sleep(3).then(() => {
          const hasError = Boolean(Math.floor(Math.random() * 2));
          if (hasError) {
            throw "Unexpected error occured";
          } else {
            alert(JSON.stringify(data));
          }
        })
      },
    });
    const handleChange = useSettersAsEventHandler(setValue);
    console.log(JSON.stringify(values, null, 2));
    return (
      <form onSubmit={submit}>
        <div>
          {submitFeedback.error && <span>{submitFeedback.error}</span>}
        </div>
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
        <input disabled={isSubmitting} type="submit" />
      </form>
    );
  }
