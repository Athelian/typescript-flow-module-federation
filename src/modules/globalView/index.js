// @flow
import React from 'react';
import InlineTextInput from './components/InlineTextInput';
import { TableHeaderStyle } from './style';

type Props = {
  keys: Array<string>,
  data: Array<Object>,
};

export default function Table({ keys, data }: Props) {
  return (
    <table>
      <thead className={TableHeaderStyle}>
        <tr>
          {keys.map(fieldKey => (
            <th key={fieldKey}>{fieldKey}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.id}>
            {item &&
              item.map(field => (
                <td>
                  {field && field.value && <InlineTextInput name={field.key} value={field.value} />}
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
