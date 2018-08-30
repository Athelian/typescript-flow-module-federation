// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';

import BadgeStyle from './style';

type Props = {
  value: number,
  color: string,
};

export default function Badge({ value, color }: Props) {
  return (
    <div className={BadgeStyle(color)}>
      <FormattedNumber value={value} />
    </div>
  );
}
