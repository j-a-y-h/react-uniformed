import React from "react";
import ReactDOM from "react-dom";
import { useForm, useSettersAsEventHandler, useConstraints } from "../src";

function Form() {
  const validators = useConstraints({
    name: { required: true, minLength: 1, maxLength: 55 },
    email: { required: true, type: "email" },
    phone: { pattern: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/ },
    website: { type: "url" },
  });
  const { setValue, validateByName, values, errors, submit } = useForm({
    validators,
    onSubmit: data => alert(JSON.stringify(data)),
  });
  const handleChange = useSettersAsEventHandler(setValue);
  const handleBlur = useSettersAsEventHandler(validateByName);
  return (
    <form onSubmit={submit}>
      {Object.keys(errors).map(error => (
        <p style={{ color: "red" }} key={error}>{errors[error]}</p>
      ))}
      <div>
        <label>Name</label>
        <input
          type="text"
          name="firstName"
          value={values.firstName}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="text"
          name="email"
          value={values.email}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Mobile number</label>
        <input
          type="tel"
          name="phone"
          value={values.phone}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
      <input type="submit" />
    </form>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<Form />, rootElement);
