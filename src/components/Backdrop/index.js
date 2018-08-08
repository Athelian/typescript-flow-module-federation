// @flow
import * as React from 'react';
import { ChildrenWrapperStyle, BackdropStyle, WrapperStyle } from './style';

type Props = {
  children: React.Node,
  active: boolean,
};

const Backdrop = ({ children, active }: Props) => (
  <div className={WrapperStyle}>
    <div className={ChildrenWrapperStyle(active)}>{children}</div>
    {active && <div className={BackdropStyle} />}
  </div>
);

export default Backdrop;
