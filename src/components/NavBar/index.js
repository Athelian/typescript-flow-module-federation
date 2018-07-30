// @flow
import * as React from 'react';
import Settings from './components/Settings';
import { NavBarStyle, ChildrenStyle } from './style';

type Props = {
  children: React.Node,
};

function NavBar({ children }: Props) {
  return (
    <div className={NavBarStyle}>
      <div className={ChildrenStyle}>{children}</div>
      <Settings />
    </div>
  );
}

export default NavBar;
