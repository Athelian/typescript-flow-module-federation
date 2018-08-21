// @flow
import * as React from 'react';
import Label from 'components/Label';
import type { LabelProps } from 'components/Label/type.js.flow';
import { ValueStyle } from './style';

type Props = LabelProps & {
  ellipsis?: boolean,
  children: any,
};

const Display = (props: Props) => {
  const { ellipsis = true, children, ...rest } = props;
  return (
    <Label {...rest}>
      <div className={ValueStyle(ellipsis)}>{children}</div>
    </Label>
  );
};

export default Display;
