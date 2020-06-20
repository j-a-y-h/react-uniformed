import React from 'react';
import { useForm, useSettersAsEventHandler } from '../src';

export default function Form() {
  const { setValue, validateByName, values, errors, submit } = useForm({
    constraints: {
      name: {
        required: 'Name is required.',
        minLength: [1, 'Please enter a valid name.'],
        maxLength: [55, 'Name is too long!'],
      },
      email: {
        required: 'Email is required.',
        type: ['email', 'Please enter a valid email address.'],
      },
      phone: {
        pattern: [
          /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
          'Please enter a valid phone number or leave the field blank.',
        ],
      },
      website: {
        type: ['url', 'Please enter a valid website url or leave the field blank.'],
      },
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
              {errors[error]}
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
