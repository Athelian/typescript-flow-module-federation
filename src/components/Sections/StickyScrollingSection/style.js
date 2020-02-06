// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, scrollbars } from 'styles/common';

export const StickyScrollingSectionWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  width: 880px;
`;

export const StickyStyle = (top: number): string => css`
  position: sticky;
  top: ${top}px;
  width: 100%;
  z-index: 2;
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const StickySectionBodyStyle: string = css`
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${colors.GRAY_VERY_LIGHT};
`;

export const GridBodyStyle: string = css`
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 195px);
  grid-auto-rows: min-content;
  grid-gap: 20px;
  padding: 30px 20px;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;
