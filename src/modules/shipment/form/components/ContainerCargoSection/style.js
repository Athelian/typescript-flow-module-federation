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

export const CargoSectionWrapperStyle: string = css`
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

export const CargoBodyWrapperStyle: string = css`
  position: relative;
  display: grid;
  grid-template-columns: 235px 1fr;
  grid-template-rows: 1fr;
  overflow: hidden;
`;

export const ContainersBodyWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  grid-gap: 30px;
  position: relative;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
  height: 100%;
  max-height: 65vh;
  ${shadows.HEADER_RIGHT};
  padding: 30px 10px 30px 20px;
`;

export const BatchesBodyWrapperStyle: string = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(195px, 1fr));
  grid-auto-rows: min-content;
  grid-row-gap: 30px;
  grid-column-gap: 10px;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
  height: 100%;
  max-height: 65vh;
  ${shadows.HEADER_LEFT};
  padding: 30px 10px 30px 20px;
`;

export const EmptyMessageStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  padding: 100px 0;
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
  display: flex;
  align-items: center;
  justify-content: center;
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
