import React from "react";
import { useSettersAsRefEventHandler, useFields } from "../src";

export default {
  title: "useHandlers"
}

export function Basic() {
  const { setValue } = useFields();
  const changeRef = useSettersAsRefEventHandler<HTMLInputElement>(setValue);
  return (
    <form onSubmit={(i) => i.preventDefault()}>
      <input name="name" ref={changeRef} />
      <br />
      <input type="submit" />
    </form>
  );
}


export function MountedValues() {
  const { values, setValue, resetValues } = useFields();
  const changeRef = useSettersAsRefEventHandler<HTMLInputElement>({
    handlers: [setValue],
    mountedValues: values,
  });
  const [showInput, setShowInput] = React.useState(true);
  return (
    <form onSubmit={(i) => i.preventDefault()}>
      {showInput && <input name="name" ref={changeRef} />}
      <br />
      <button onClick={() => setShowInput(i => !i)}>Hide Input</button>
      <button onClick={resetValues}>Clear values</button>
      <input type="submit" />
    </form>
  );
}
