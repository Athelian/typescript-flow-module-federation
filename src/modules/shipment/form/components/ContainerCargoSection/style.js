// @flow
import { css } from 'react-emotion';
import {
  presets,
  colors,
  scrollbars,
  fontSizes,
  layout,
  shadows,
  borderRadiuses,
} from 'styles/common';

export const ItemsSectionWrapperStyle: string = css`
  position: relative;
  ${presets.BOX};
  width: 880px;
  height: min-content;
`;

export const NavbarWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  position: relative;
  display: grid;
  grid-template-columns: 235px 1fr;
  grid-template-rows: 50px;
  ${shadows.HEADER};
  z-index: 1;
`;

export const NavbarLeftWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  position: relative;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  ${shadows.HEADER_RIGHT};
  z-index: 1;
`;

export const NavbarRightWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 0;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  ${shadows.HEADER_LEFT};
`;

export const ItemsSectionBodyStyle: string = css`
  background-color: ${colors.GRAY_SUPER_LIGHT};
  max-height: 70vh;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
`;

export const ItemGridStyle: string = css`
  display: flex;
  flex-wrap: wrap;
  padding: 15px 0 15px 10px;
`;

export const ItemStyle: string = css`
  display: flex;
  margin: 15px 10px;
`;

export const EmptyMessageStyle: string = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  text-align: center;
  padding: 100px;
`;

export const FooterWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  position: relative;
  display: grid;
  grid-template-columns: 235px 1fr;
  grid-template-rows: 50px;
  ${shadows.HEADER};
  z-index: 1;
`;

export const FooterLeftWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  position: relative;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  ${shadows.HEADER_RIGHT};
  z-index: 1;
`;

export const FooterRightWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  justify-content: end;
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 0;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  ${shadows.HEADER_LEFT};
  align-items: center;
  padding: 0 10px;
`;
