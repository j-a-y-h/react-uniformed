import React from "react";
import ReactDOM from "react-dom";
import { useForm, useSettersAsEventHandler, useConstraints } from "../src";

function Form() {
  const validator = useConstraints({
    firstName: { required: true, minLength: 5, maxLength: 4 },
    lastName: { required: true, maxLength: 100 },
    email: { required: true, type: "email" },
    phone: { required: true, maxLength: 11, minLength: 8 }
  });
  const { setValue, validateByName, values, errors, submit } = useForm({
    validators: validator,
    onSubmit: data => {
      alert(JSON.stringify(data));
    }
  });
  const handleChange = useSettersAsEventHandler(setValue);
  const handleBlur = useSettersAsEventHandler(validateByName);
  console.log(errors, values);
  return (
    <form onSubmit={submit}>
      {Object.keys(errors).map(error => {
        return (
          <p style={{ color: "red" }} key={error}>
            {errors[error]}
          </p>
        );
      })}
      <div>
        <label>First name</label>
        <input
          value={values.firstName}
          type="text"
          name="firstName"
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Last name</label>
        <input
          value={values.lastName}
          type="text"
          name="lastName"
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          value={values.email}
          type="text"
          name="email"
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Mobile number</label>
        <input
          value={values.phone}
          type="tel"
          name="phone"
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          value={values.startDate}
          type="date"
          name="startDate"
          onChange={handleChange}
        />
      </div>

      <div>
        <input
          value={values.endDate}
          type="date"
          name="endDate"
          onChange={handleChange}
        />
      </div>
      <input type="submit" />
    </form>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<Form />, rootElement);
