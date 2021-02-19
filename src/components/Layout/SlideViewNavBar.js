// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import { NavBarWrapperStyle, SlideViewNavBarStyle, SubNavBarWrapperStyle } from './style';

type Props = {
  isSubNavBar?: boolean,
  children: React.Node,
};

const SlideViewNavBar = ({ isSubNavBar = false, children }: Props) => (
  <div className={cx(NavBarWrapperStyle, { [SubNavBarWrapperStyle]: isSubNavBar })}>
    <div className={SlideViewNavBarStyle}>{children}</div>
  </div>
);

export default SlideViewNavBar;
