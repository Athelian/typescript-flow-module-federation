// @flow
import { css } from 'react-emotion';
import {
  colors,
  shadows,
  borderRadiuses,
  layout,
  presets,
  fontSizes,
  scrollbars,
} from 'styles/common';

export const ContainersWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  position: relative;
  display: grid;
  grid-template-columns: 235px;
  grid-template-rows: 50px 1fr 50px;
  ${shadows.HEADER_RIGHT};
  z-index: 2;
`;

export const ContainersNavbarWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  ${shadows.HEADER};
  position: relative;
`;

export const ContainersBodyWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 65vh;
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const ContainersHeaderWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-template-rows: 50px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  ${fontSizes.LARGE};
  color: ${colors.GRAY_DARK};
`;

export const IconStyle: string = css`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const TitleStyle: string = css`
  ${presets.ELLIPSIS};
  font-weight: bold;
  letter-spacing: 2px;
`;

export const ContainersGridStyle: string = css`
  display: grid;
  grid-template-columns: 195px;
  grid-auto-rows: min-content;
  grid-gap: 30px;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
  padding: 30px 10px 30px 20px;
  height: 100%;
`;

export const ContainersFooterWrapperStyle: string = css`
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
  ${shadows.HEADER_REVERSE};
`;
