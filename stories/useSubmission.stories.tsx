import React from "react";
import { useSubmission } from "../src";

export default {
  title: "useSubmission"
}

const sleep = (duration: number) => {
  return new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, duration * 1000);
  });
}

export function Form() {
  const { isSubmitting, submitCount, submit } = useSubmission({
    onSubmit: () => {
      console.log("called");
      return sleep(1);
    },
  });
  return (
    <form onSubmit={submit}>
      {isSubmitting && (<p>Is Submitting...</p>)}
      <div>
        <label>Name </label>
        <input
          type="text"
          name="name"
          value="John"
        />
      </div>
      <input type="submit" />
      <div>
        <label>Submit count: {submitCount}</label>
      </div>
    </form>
  );
}
