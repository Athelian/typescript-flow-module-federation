// @flow
import * as React from 'react';
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

type Props = {
  message: React.Node | string,
  children: React.Node,
};

export default function Tooltip({ message, children }: Props) {
  return (
    <Tippy content={message} arrow arrowType="round">
      {children}
    </Tippy>
  );
}
