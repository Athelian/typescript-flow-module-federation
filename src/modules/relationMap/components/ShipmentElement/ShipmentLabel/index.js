// @flow
import * as React from 'react';
import { ShipmentLabelStyle } from './style';

type Props = {
  name: string,
  vol: string,
};

export default function ShipmentLabel({ name = '', vol = '' }: Props) {
  return (
    <div className={ShipmentLabelStyle}>
      <span>{name}</span>
      <span>{vol}</span>
    </div>
  );
}
