// @flow
import * as React from 'react';
import UserNavbar from 'modules/userNavbar';
import { NavBarStyle, ChildrenWrapperStyle } from './style';

type Props = {
  children?: React.Node,
};

const NavBar = ({ children }: Props) => (
  <div className={NavBarStyle}>
    <div className={ChildrenWrapperStyle}>{children}</div>
    <UserNavbar />
  </div>
);

export default NavBar;
