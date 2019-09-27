// @flow
import * as React from 'react';
import Tippy from '@tippy.js/react';

type OptionalProps = {
  delay: number,
};

type Props = OptionalProps & {
  message: React.Node | string,
  children: React.Node,
};

const defaultProps = {
  delay: 200,
};

export default function Tooltip({ message, children, delay, ...rest }: Props) {
  return (
    <Tippy
      content={message}
      arrow
      arrowType="round"
      delay={delay}
      distance={10}
      interactive
      ignoreAttributes
      maxWidth={1000}
      {...rest}
    >
      {children}
    </Tippy>
  );
}

Tooltip.defaultProps = defaultProps;
