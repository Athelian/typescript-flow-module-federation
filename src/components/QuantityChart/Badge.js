// @flow
import * as React from 'react';

import { badgeStyle } from 'components/QuantityChart/style';

type Props = {
  value: number,
  color: string,
};

export default function Badge({ value, color }: Props) {
  return <div className={badgeStyle(color)}>{value}</div>;
}
