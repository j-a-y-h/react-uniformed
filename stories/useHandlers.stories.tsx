import React from "react";
import { useSettersAsRefEventHandler, useFields } from "../src";

export default {
  title: "useHandlers"
}

export function Basic() {
  const {values, setValue} = useFields();
  const changeRef = useSettersAsRefEventHandler<HTMLInputElement>(setValue);

  return (
    <form onSubmit={(i) => i.preventDefault()}>
      <input name="name" value={values.name} ref={changeRef} />
      <input type="submit" />
    </form>
  );
}
