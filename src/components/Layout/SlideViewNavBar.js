// @flow
import * as React from 'react';
import cs from 'clsx';
import { NavBarWrapperStyle, SlideViewNavBarStyle, SubNavBarWrapperStyle } from './style';

type Props = {
  isSubNavBar?: boolean,
  children: React.Node,
};

const SlideViewNavBar = ({ isSubNavBar = false, children }: Props) => (
  <div className={cs(NavBarWrapperStyle, { [SubNavBarWrapperStyle]: isSubNavBar })}>
    <div className={SlideViewNavBarStyle}>{children}</div>
  </div>
);

export default SlideViewNavBar;
