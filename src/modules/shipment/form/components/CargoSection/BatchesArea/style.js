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

export const BatchesWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 50px 1fr 50px;
`;

export const BatchesNavbarWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 150px auto;
  align-items: center;
  padding-left: 10px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 0;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  ${shadows.HEADER};
  position: relative;
`;

export const BatchesBodyWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 65vh;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  ${shadows.HEADER_LEFT}
`;

export const BatchesHeaderWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-template-rows: 50px;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const TitleWrapperStyle: string = css`
  display: flex;
  align-items: center;
  ${fontSizes.LARGE};
  color: ${colors.GRAY_DARK};
`;

export const SubTitleWrapperStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  background-color: ${colors.GRAY_VERY_LIGHT};
  padding: 5px;
  ${borderRadiuses.BUTTON};
  letter-spacing: 2px;
`;

export const SubTitleIconStyle: string = css`
  margin-left: 5px;
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

export const BatchesGridStyle: string = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(195px, 1fr));
  grid-auto-rows: min-content;
  grid-row-gap: 30px;
  grid-column-gap: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
  padding: 30px 10px 30px 20px;
  height: 100%;
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

export const BatchesFooterWrapperStyle: string = css`
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
  ${shadows.HEADER_REVERSE};
  align-items: center;
  padding: 0 10px;
  position: relative;
`;
