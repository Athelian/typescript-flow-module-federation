// @flow
import * as React from 'react';
import { NavBarWrapperStyle, SlideViewNavBarStyle } from './style';

type Props = {
  children: React.Node,
};

const SlideViewNavBar = ({ children }: Props) => (
  <div className={NavBarWrapperStyle}>
    <div className={SlideViewNavBarStyle}>{children}</div>
  </div>
);

export default SlideViewNavBar;
