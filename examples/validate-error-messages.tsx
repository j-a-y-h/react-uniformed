import React from "react";
import { useForm, useSettersAsEventHandler, useConstraints } from "../src";

export default function Form() {
  const validators = useConstraints({
      name: {
          required: "Please enter your name",
          minLength: [1, "please enter a valid name"],
          maxLength: [55, "name is too long"]
      },
      email: {
          required: "email is required!",
          type: ["email", "please enter a valid email address"]
      },
      phone: {
          pattern: [
            /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
            "please enter a valide phone number"
        ]
    },
      website: {
          type: "url"
      },
  });
  const { setValue, validateByName, values, errors, submit } = useForm({
    validators,
    onSubmit: data => alert(JSON.stringify(data)),
  });
  const handleChange = useSettersAsEventHandler(setValue);
  const handleBlur = useSettersAsEventHandler(validateByName);
  return (
    <form onSubmit={submit}>
      {Object.keys(errors).map(error => errors[error] && (
        <p style={{ color: "red" }} key={error}>{errors[error]}</p>
      ))}
      <div>
        <label>Name </label>
        <input
          type="text"
          name="name"
          value={values.name}
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
      <div>
        <label>Website</label>
        <input
          type="text"
          name="website"
          value={values.website}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
      <input type="submit" />
    </form>
  );
}
