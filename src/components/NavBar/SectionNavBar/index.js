// @flow
import * as React from 'react';
import { SectionNavBarStyle, SectionNavBarChildrenWrapperStyle } from './style';

type Props = {
  children: React.Node,
};

const SectionNavBar = ({ children }: Props) => (
  <div className={SectionNavBarStyle}>
    <div className={SectionNavBarChildrenWrapperStyle}>{children}</div>
  </div>
);

export default SectionNavBar;
