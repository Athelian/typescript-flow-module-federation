// @flow
import * as React from 'react';
import { SectionNavBar } from 'components/NavBar';
import { ScrollingSectionWrapperStyle, ScrollingSectionBodyStyle } from './style';

type Props = {
  navbarContent?: React$Node,
  children: React$Node,
};

const ScrollingSection = ({ navbarContent = null, children }: Props) => (
  <div className={ScrollingSectionWrapperStyle}>
    <SectionNavBar>{navbarContent}</SectionNavBar>

    <div className={ScrollingSectionBodyStyle}>{children}</div>
  </div>
);

export default ScrollingSection;
