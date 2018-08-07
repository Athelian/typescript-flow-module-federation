import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import { css } from 'react-emotion';
import { colors } from 'styles/common';

import JumpToSection from './index';

const NavbarStyle = css`
  position: fixed;
  display: flex;
  width: 100%;
  line-height: 60px;
  background: #fff;
`;
const SectionLinkStyle = isActive => css`
  min-width: 100px;
  text-align: center;
  cursor: pointer;
  background: #fff;
  line-height: 60px;
  border: 0;
  ${isActive &&
    `
    border-bottom: 5px solid ${colors.BLUE_DARK};
  `};
`;
const Section1Style = css`
  background: ${colors.TEAL_LIGHT};
  height: 500px;
`;
const Section2Style = css`
  background: ${colors.GRAY_LIGHT};
  height: 500px;
`;
const Section3Style = css`
  background: ${colors.BLUE};
  height: 500px;
`;
const Section4Style = css`
  background: ${colors.YELLOW};
  height: 500px;
`;

/* eslint-disable react/prop-types */
function SectionLink({ children, active, onClick }) {
  return (
    <button type="button" className={SectionLinkStyle(active)} onClick={onClick}>
      {children}
    </button>
  );
}

storiesOf('JumpToSection', module).add('default', () => (
  <div>
    <nav className={NavbarStyle}>
      <JumpToSection>
        <SectionLink link="section1">Section1</SectionLink>
        <SectionLink link="section2">Section2</SectionLink>
        <SectionLink link="section3">Section3</SectionLink>
        <SectionLink link="section4">Section4</SectionLink>
      </JumpToSection>
    </nav>
    <div className={Section1Style} id="section1" />
    <div className={Section2Style} id="section2" />
    <div className={Section3Style} id="section3" />
    <div className={Section4Style} id="section4" />
  </div>
));
