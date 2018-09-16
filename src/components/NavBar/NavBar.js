// @flow
import * as React from 'react';
import { NavBarStyle, ChildrenWrapperStyle } from './style';

type OptionalProps = {
  setting: React.Node,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  setting: null,
};

const NavBar = ({ children, setting }: Props) => (
  <div className={NavBarStyle}>
    <div className={ChildrenWrapperStyle}>{children}</div>
    {setting}
  </div>
);

NavBar.defaultProps = defaultProps;

export default NavBar;
