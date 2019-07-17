// @flow
import * as React from 'react';
import UserNavbar from 'modules/userNavbar';
import { NavBarWrapperStyle, NavBarStyle } from './style';

type Props = {
  children?: React.Node,
};

const NavBar = ({ children }: Props) => (
  <div className={NavBarWrapperStyle}>
    <div className={NavBarStyle}>{children}</div>
    <UserNavbar />
  </div>
);

export default NavBar;
