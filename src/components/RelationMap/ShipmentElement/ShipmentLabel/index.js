// @flow
import * as React from 'react';
import { ShipmentLabelStyle } from './style';

type Props = {
  name: string,
  vol: number,
  metric: 'cm³' | 'm³',
};

type cbmType = {
  vol: number,
  metric: 'cm³' | 'm³',
};

const cbmElement = ({ vol, metric }: cbmType) => (
  <span>
    {vol} {metric}
  </span>
);

export default function ShipmentLabel({ name = '', vol = 0, metric = 'cm³' }: Props) {
  return (
    <div className={ShipmentLabelStyle}>
      <span>{name}</span>
      {vol && cbmElement({ vol, metric })}
    </div>
  );
}
