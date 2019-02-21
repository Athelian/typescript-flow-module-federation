// @flow
import * as React from 'react';
import Setting from 'modules/setting';
import { NavBarStyle, ChildrenWrapperStyle } from './style';

type Props = {
  children?: React.Node,
};

const NavBar = ({ children }: Props) => (
  <div className={NavBarStyle}>
    <div className={ChildrenWrapperStyle}>{children}</div>
    <Setting />
  </div>
);

export default NavBar;
