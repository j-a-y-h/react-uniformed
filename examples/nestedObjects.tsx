import React from 'react';
import { useForm, useSettersAsEventHandler, normalizeNestedObjects } from '../src';

export default function Form() {
  const { submit, setValue, values } = useForm({
    initialValues: {
      users: [{ name: '', email: '' }],
    },
    normalizer: normalizeNestedObjects(),
    onSubmit: (data) => alert(JSON.stringify(data)),
  });
  const handleChange = useSettersAsEventHandler(setValue);
  return (
    <div className='App'>
      <code>
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </code>
      <form onSubmit={submit}>
        <div>
          <label htmlFor='users[0][name]'>Name</label>
          <input
            name='users[0][name]'
            placeholder='Enter name'
            value={values.users[0].name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='users[0][email]'>Email</label>
          <input
            name='users[0][email]'
            placeholder='Enter email'
            value={values.users[0].email}
            onChange={handleChange}
          />
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}
