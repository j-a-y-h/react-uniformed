import React from 'react';
import { useForm, useSettersAsEventHandler } from '../src';

export default function Form() {
  const { setValue, validateByName, values, errors, submit } = useForm({
    constraints: {
      name: { required: true, minLength: 1, maxLength: 55 },
      email: { required: true, type: 'email' },
      phone: { pattern: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/ },
      website: { type: 'url' },
    },
    onSubmit: (data) => alert(JSON.stringify(data)),
  });
  const handleChange = useSettersAsEventHandler(setValue);
  const handleBlur = useSettersAsEventHandler(validateByName);
  return (
    <form onSubmit={submit}>
      {Object.keys(errors).map(
        (error) =>
          errors[error] && (
            <p style={{ color: 'red' }} key={error}>
              [{error}]: {errors[error]}
            </p>
          ),
      )}
      <div>
        <label>Name </label>
        <input
          type='text'
          name='name'
          value={values.name}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type='text'
          name='email'
          value={values.email}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Mobile number</label>
        <input
          type='tel'
          name='phone'
          value={values.phone}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Website</label>
        <input
          type='text'
          name='website'
          value={values.website}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
      <input type='submit' />
    </form>
  );
}
