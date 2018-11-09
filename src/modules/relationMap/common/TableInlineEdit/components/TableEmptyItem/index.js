// @flow
import * as React from 'react';
import { WrapperStyle, EmptyItemStyle } from './style';

type Props = {
  fields: Array<{
    name: string,
    type: string,
  }>,
};

export default function TableEmptyItem({ fields }: Props) {
  return (
    <div className={WrapperStyle}>
      {fields.map(({ name, type }) => (
        <div key={`${name}-${type}`} className={EmptyItemStyle} />
      ))}
    </div>
  );
}
