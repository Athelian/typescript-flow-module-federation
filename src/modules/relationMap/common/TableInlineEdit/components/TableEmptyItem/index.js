// @flow
import * as React from 'react';
import { WrapperStyle, EmptyItemStyle } from './style';

type Props = {
  fields: Array<{
    id?: string,
    name: string,
    type: string,
    meta?: Object,
  }>,
};

export default function TableEmptyItem({ fields }: Props) {
  return (
    <div className={WrapperStyle}>
      {fields.map(({ name, type, id }) => (
        <div key={`${name}-${type || id || ''}`} className={EmptyItemStyle} />
      ))}
    </div>
  );
}
