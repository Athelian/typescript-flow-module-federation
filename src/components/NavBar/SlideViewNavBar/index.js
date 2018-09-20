// @flow
import * as React from 'react';
import { SlideViewNavBarStyle, SlideViewNavBarChildrenWrapperStyle } from './style';

type Props = {
  children: React.Node,
};

const SlideViewNavBar = ({ children }: Props) => (
  <div className={SlideViewNavBarStyle}>
    <div className={SlideViewNavBarChildrenWrapperStyle}>{children}</div>
  </div>
);

export default SlideViewNavBar;
