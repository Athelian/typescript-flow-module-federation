// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber/index';

import { NumberStyle } from './style';

type Props = {
  value: number,
  color: string,
};

export default function Number({ value = 0, color }: Props) {
  return (
    <span className={NumberStyle(color)}>
      <FormattedNumber value={value} />
    </span>
  );
}
