// @flow
import { css } from 'react-emotion';
import {
  borderRadiuses,
  colors,
  fontSizes,
  layout,
  presets,
  scrollbars,
  shadows,
  transitions,
} from 'styles/common';

export const DownshiftStyle: string = css`
  width: 100%;
`;

export const OptionsWrapperStyle = (width: number, height: number): string => css`
  ${shadows.INPUT};
  ${borderRadiuses.MAIN};
  position: fixed;
  z-index: 100;
  background: ${colors.WHITE};
  height: ${height}px;
  width: ${width}px;
  margin-top: 5px;
  overflow: hidden;
  & > div {
    ${scrollbars.SMALL};
  }
`;

export const DefaultOptionStyle = (highlighted: boolean, selected: boolean): string => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${fontSizes.MAIN};
  ${presets.ELLIPSIS};
  color: ${selected ? colors.TEAL : colors.BLACK};
  background: ${highlighted ? colors.GRAY_SUPER_LIGHT : colors.WHITE};
  width: 100%;
  height: 100%;
  font-weight: bold;
  padding: 0 5px;
  cursor: pointer;
  ${transitions.MAIN};
`;
