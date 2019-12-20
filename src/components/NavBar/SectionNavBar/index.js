// @flow
import * as React from 'react';
import { SectionNavBarStyle, SectionNavBarChildrenWrapperStyle } from './style';

type Props = {
  children: React$Node,
  upsideDown?: boolean,
};

const SectionNavBar = ({ children, upsideDown }: Props) => (
  <div className={SectionNavBarStyle(!!upsideDown)}>
    <div className={SectionNavBarChildrenWrapperStyle}>{children}</div>
  </div>
);

export default SectionNavBar;
