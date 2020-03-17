// @flow
import * as React from 'react';
import Tooltip from '../Tooltip';

type OptionalProps = {
  delay?: number | [number, number],
};

type Props = OptionalProps & {
  message: React.Node | string,
  children: React.Node | string,
};

export default function FullValueTooltip({ message, children, delay, ...rest }: Props) {
  return (
    <Tooltip delay={delay || 500} message={message} {...rest}>
      {children}
    </Tooltip>
  );
}
