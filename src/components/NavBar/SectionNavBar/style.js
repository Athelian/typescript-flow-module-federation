// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, shadows, transitions } from 'styles/common';
import { ChildrenWrapperStyle } from 'components/NavBar/style';

export const SectionNavBarStyle = (upsideDown: boolean): string => css`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  padding: 0 10px;
  z-index: 2;
  ${shadows.HEADER};
  ${transitions.EXPAND};
  ${borderRadiuses.MAIN};
  ${upsideDown
    ? `
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  `
    : `
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  `};
`;

export const SectionNavBarChildrenWrapperStyle: string = css`
  ${ChildrenWrapperStyle};
`;
