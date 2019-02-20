// @flow
import * as React from 'react';
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

type Props = {
  message: React.Node | string,
  children: React.Node,
};

export default function Tooltip({ message, children, ...rest }: Props) {
  return (
    <Tippy
      content={message}
      arrow
      arrowType="round"
      delay={[200, 200]}
      distance={10}
      interactive
      performance
      {...rest}
    >
      {children}
    </Tippy>
  );
}
