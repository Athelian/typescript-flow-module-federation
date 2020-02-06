// @flow
import * as React from 'react';
import { SectionNavBar } from 'components/NavBar';
import {
  StickyScrollingSectionWrapperStyle,
  StickyStyle,
  StickySectionBodyStyle,
  GridBodyStyle,
} from './style';

type Props = {
  sectionHeader: React$Node,
  navbarContent?: React$Node,
  children: React$Node,
};

const StickyScrollingSection = ({ sectionHeader, navbarContent = null, children }: Props) => (
  <>
    <div className={StickyStyle(0)}>{sectionHeader}</div>

    <div className={StickyScrollingSectionWrapperStyle}>
      <div className={StickyStyle(0)}>
        <SectionNavBar>{navbarContent}</SectionNavBar>
      </div>

      <div className={StickySectionBodyStyle}>
        {/* TODO: Extract as component */}
        <div className={GridBodyStyle}>{children}</div>
      </div>
    </div>
  </>
);

export default StickyScrollingSection;
