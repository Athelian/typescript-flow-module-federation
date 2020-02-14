// @flow
import * as React from 'react';
import { SectionNavBar } from 'components/NavBar';
import { StickyScrollingSectionWrapperStyle, StickyStyle, StickySectionBodyStyle } from './style';

type Props = {
  sectionHeader: React$Node,
  navbarContent?: React$Node,
  children: React$Node,
};

const StickyScrollingSection = ({ sectionHeader, navbarContent = null, children }: Props) => (
  <>
    <div className={StickyStyle}>{sectionHeader}</div>

    <div className={StickyScrollingSectionWrapperStyle}>
      <div className={StickyStyle}>
        <SectionNavBar>{navbarContent}</SectionNavBar>
      </div>

      <div className={StickySectionBodyStyle}>{children}</div>
    </div>
  </>
);

export default StickyScrollingSection;
