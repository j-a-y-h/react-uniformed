import React from 'react';
import { useForm, useSettersAsEventHandler, useAnchor } from '../src';

export default {
  title: 'useConstraints',
};

export function Form() {
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
  const { anchor } = useAnchor({ handleBlur, handleChange, values });
  return (
    <form ref={anchor}>
      <div>
        <label>Name </label>
        <input type='text' name='name' />
      </div>
      <div>
        <label>Email</label>
        <input type='text' name='email' />
      </div>
      <div>
        <label>Mobile number</label>
        <input type='tel' name='phone' />
      </div>
      <div>
        <label>Website</label>
        <input type='text' name='website' />
      </div>
      <input type='submit' />
    </form>
  );
}
