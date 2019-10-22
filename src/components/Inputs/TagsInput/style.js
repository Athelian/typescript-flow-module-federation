// @flow
import { css } from 'react-emotion';
import {
  fontSizes,
  borderRadiuses,
  colors,
  scrollbars,
  shadows,
  presets,
  layout,
} from 'styles/common';

export const OptionsWrapperStyle = (width: number, height: number) => css`
  ${shadows.INPUT};
  ${scrollbars.SMALL};
  ${borderRadiuses.MAIN};
  position: fixed;
  z-index: 100;
  background: ${colors.WHITE};
  height: ${height}px;
  width: ${width}px;
  margin-top: 5px;
  overflow: hidden;
`;

export const OptionStyle = (selected: boolean, highlighted: boolean) => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${presets.ELLIPSIS};
  ${fontSizes.MAIN};
  background-color: ${highlighted ? colors.GRAY_SUPER_LIGHT : colors.WHITE};
  color: ${selected ? colors.TEAL : colors.BLACK};
  line-height: 20px;
  font-weight: bold;
  padding: 5px;
`;

export const SelectedStyle = css`
  min-width: 20px;
  margin-right: 3px;
`;
