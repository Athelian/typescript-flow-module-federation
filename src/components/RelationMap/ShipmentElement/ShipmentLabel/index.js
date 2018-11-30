// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import { ShipmentLabelStyle } from './style';

type Props = {
  name: string,
  value: number,
  metric: 'cm³' | 'm³',
};

type cbmType = {
  value: number,
  metric: 'cm³' | 'm³',
};

const cbmElement = ({ value, metric }: cbmType) => (
  <span>
    <FormattedNumber value={value} /> {metric}
  </span>
);

export default function ShipmentLabel({ name = '', value = 0, metric = 'cm³' }: Props) {
  return (
    <div className={ShipmentLabelStyle}>
      <span>{name}</span>
      {value && cbmElement({ value, metric })}
    </div>
  );
}
