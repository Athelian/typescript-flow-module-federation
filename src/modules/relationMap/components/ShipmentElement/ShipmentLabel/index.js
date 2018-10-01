// @flow
import * as React from 'react';

type Props = {
  name: string,
  vol: string,
};

export default function ShipmentLabel({ name = '', vol = '' }: Props) {
  return (
    <div>
      <span>{name}</span>
      <span>{vol}</span>
    </div>
  );
}
