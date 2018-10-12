// @flow
import * as React from 'react';
import Setting from 'modules/setting';
import { NavBarStyle, RelationMapNavBarChildrenWrapperStyle } from './style';

type Props = {
  children: React.Node,
};

const RelationMapNavBar = ({ children }: Props) => (
  <div className={NavBarStyle}>
    <div className={RelationMapNavBarChildrenWrapperStyle}>{children}</div>
    <Setting />
  </div>
);

export default RelationMapNavBar;
