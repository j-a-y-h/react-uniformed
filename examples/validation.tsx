import React from "react";
import ReactDOM from "react-dom";
import { useForm, useSettersAsEventHandler, useConstraints } from "../src";

function Form() {
  const validator = useConstraints({
    name: { required: true, minLength: 1, maxLength: 55 },
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
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Mobile number</label>
        <input
          type="tel"
          name="phone"
          value={values.phone}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Start Date</label>
        <input
          type="date"
          name="startDate"
          value={values.startDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>End Date</label>
        <input
          type="date"
          name="endDate"
          value={values.endDate}
          onChange={handleChange}
        />
      </div>
      <input type="submit" />
    </form>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<Form />, rootElement);
