// @flow
import * as React from 'react';
import { ShipmentLabelStyle } from './style';

type Props = {
  name: string,
  vol: string,
};

const cbmElement = vol => (
  <span>
    {vol}m<sup>3</sup>
  </span>
);

export default function ShipmentLabel({ name = '', vol = '' }: Props) {
  return (
    <div className={ShipmentLabelStyle}>
      <span>{name}</span>
      {vol && cbmElement(vol)}
    </div>
  );
}
