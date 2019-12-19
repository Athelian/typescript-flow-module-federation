// @flow
import * as React from 'react';
import { SectionNavBar } from 'components/NavBar';
import { SingleCardSectionWrapperStyle, SingleCardSectionBodyStyle } from './style';

type Props = {
  navbarContent?: React$Node,
  children: React$Node,
};

const SingleCardSection = ({ navbarContent = null, children }: Props) => (
  <div className={SingleCardSectionWrapperStyle}>
    <SectionNavBar>{navbarContent}</SectionNavBar>

    <div className={SingleCardSectionBodyStyle}>{children}</div>
  </div>
);

export default SingleCardSection;
