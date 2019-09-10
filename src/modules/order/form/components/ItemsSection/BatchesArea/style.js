// @flow
import { css } from 'react-emotion';
import {
  colors,
  shadows,
  borderRadiuses,
  presets,
  fontSizes,
  scrollbars,
  transitions,
} from 'styles/common';

export const BatchesAreaWrapperStyle = (itemsIsExpanded: boolean): string => css`
  ${borderRadiuses.MAIN};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  position: relative;
  display: grid;
  grid-template-rows: 50px 1fr 50px;
  width: ${itemsIsExpanded ? '235px' : '645px'};
  ${shadows.HEADER_RIGHT};
  z-index: 2;
  ${transitions.EXPAND};
`;

export const BatchesNavbarWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
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
`;

export const BatchesHeaderWrapperStyle = (itemsIsExpanded: boolean): string => css`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: ${itemsIsExpanded ? 'flex-end' : 'space-between'};
  flex-shrink: 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const BatchesTitleWrapperStyle: string = css`
  height: 50px;
  display: flex;
  align-items: center;
  ${fontSizes.LARGE};
  color: ${colors.GRAY_DARK};
  padding: 0 10px 0 0;
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

export const AutofillButtonWrapperStyle: string = css`
  display: flex;
  align-items: flex-start;
  padding: 0 10px;
  height: 40px;
`;

export const NoBatchesFoundStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const BatchesGridStyle: string = css`
  overflow-x: hidden;
  overflow-y: overlay;
  ${scrollbars.SMALL};
  height: 100%;
  width: 100%;
`;

export const BatchesFooterWrapperStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 0;
  padding: 0 10px;
  position: relative;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  ${shadows.HEADER_REVERSE};
`;
