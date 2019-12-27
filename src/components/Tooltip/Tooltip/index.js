// @flow
import * as React from 'react';
import Tippy from '@tippy.js/react';

type OptionalProps = {
  delay?: number,
  maxWidth?: number,
};

type Props = OptionalProps & {
  message: React.Node | string,
  children: React.Node,
};

export default function Tooltip({ message, children, delay, maxWidth, ...rest }: Props) {
  return (
    <Tippy
      content={message}
      arrow
      arrowType="round"
      delay={delay || 200}
      distance={10}
      interactive
      ignoreAttributes
      {...(maxWidth ? { maxWidth } : {})}
      {...rest}
    >
      {children}
    </Tippy>
  );
}
