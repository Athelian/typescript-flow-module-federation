// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, shadows, transitions, layout } from 'styles/common';

export const SectionNavBarStyle = (upsideDown: boolean): string => css`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  padding: 0 10px;
  z-index: 1;
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
  ${layout.GRID_HORIZONTAL};
  grid-template-rows: 50px;
  grid-gap: 20px;
  align-items: center;
  width: 100%;
`;
