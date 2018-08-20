// @flow
import * as React from 'react';
import Label from 'components/Label';
import type { LabelProps } from 'components/Label/type.js.flow';
import { ValueStyle } from './style';

type Props = LabelProps & {
  value: string | number | React.Node,
  ellipsis?: boolean,
};

const Display = (props: Props) => {
  const { value, ellipsis, ...rest } = props;
  return (
    <Label {...rest}>
      <div className={ValueStyle(ellipsis || false)}>{value}</div>
    </Label>
  );
};

export default Display;
