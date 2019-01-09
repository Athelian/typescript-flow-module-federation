// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import { ShipmentLabelStyle } from './style';

type Props = {
  name: string,
  value: number,
  metric: 'cm³' | 'm³',
};

type TotalVolumeProps = {
  value: number,
  metric: 'cm³' | 'm³',
};

const TotalVolume = ({ value = 0, metric = 'm³' }: TotalVolumeProps) => (
  <span>
    <FormattedNumber value={value} /> {metric}
  </span>
);

export default function ShipmentLabel({ name = '', value = 0, metric = 'm³' }: Props) {
  return (
    <div className={ShipmentLabelStyle}>
      <span>{name}</span>
      <TotalVolume value={value} metric={metric} />
    </div>
  );
}
