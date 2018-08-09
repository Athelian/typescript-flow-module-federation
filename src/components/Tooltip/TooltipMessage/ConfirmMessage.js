// @flow
import * as React from 'react';
import { DividerLineStyle } from './style';

type Props = {
  children: React.Node,
};
const ConfirmMessage = ({ children }: Props) => (
  <div>
    {children}
    <div className={DividerLineStyle} />
  </div>
);

export default ConfirmMessage;
