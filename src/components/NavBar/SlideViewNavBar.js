// @flow
import * as React from 'react';
import { NavBarWrapperStyle, NavBarStyle } from './style';

type Props = {
  children: React.Node,
};

const SlideViewNavBar = ({ children }: Props) => (
  <div className={NavBarWrapperStyle}>
    <div className={NavBarStyle}>{children}</div>
  </div>
);

export default SlideViewNavBar;
