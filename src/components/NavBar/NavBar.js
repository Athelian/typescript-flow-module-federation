// @flow
import * as React from 'react';
import Settings from './components/Settings';
import { NavBarStyle, ChildrenWrapperStyle } from './style';

type Props = {
  children: React.Node,
};

const NavBar = ({ children }: Props) => (
  <div className={NavBarStyle}>
    <div className={ChildrenWrapperStyle}>{children}</div>
    <Settings />
  </div>
);

export default NavBar;
