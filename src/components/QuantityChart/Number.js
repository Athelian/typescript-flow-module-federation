// @flow
import * as React from 'react';

import { numberStyle } from './style';

type Props = {
  value: number,
  color: string,
};

export default function Number({ value = 0, color }: Props) {
  return <span className={numberStyle(color)}>{value}</span>;
}
