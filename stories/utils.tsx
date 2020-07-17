import React from 'react';

export function ValuesErrorsTable({ errors, values, children }) {
  return (
    <table>
      <tr>
        <td style={{ verticalAlign: 'top', width: '25%' }}>{children}</td>
        <td style={{ verticalAlign: 'top', width: '25%' }}>
          <p>Errors</p>
          <pre>{JSON.stringify(errors, null, 2)}</pre>
        </td>
        <td style={{ verticalAlign: 'top', width: '25%' }}>
          <p>Values</p>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </td>
      </tr>
    </table>
  );
}
