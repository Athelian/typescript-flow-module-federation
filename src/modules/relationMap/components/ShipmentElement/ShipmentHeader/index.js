// @flow
import * as React from 'react';

type Props = {
  name: string,
  vol: string,
};

export default function ShipmentHeader({ name = '', vol = '' }: Props) {
  return (
    <div>
      <span>{name}</span>
      <span>{vol}</span>
    </div>
  );
}
