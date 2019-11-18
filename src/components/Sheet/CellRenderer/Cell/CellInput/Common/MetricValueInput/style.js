// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, layout, presets, transitions } from 'styles/common';

export const SelectInputStyle = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  width: 30px;
  height: 30px;
  padding: 0 5px;
  text-align: left;
  font-weight: bold;
  cursor: pointer;
`;

export const SelectOptionStyle = (highlighted: boolean, selected: boolean): string => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${fontSizes.MAIN};
  ${presets.ELLIPSIS};
  ${transitions.MAIN};
  color: ${selected ? colors.TEAL : colors.BLACK};
  background: ${highlighted ? colors.GRAY_SUPER_LIGHT : colors.WHITE};
  width: 100%;
  height: 100%;
  font-weight: bold;
  padding: 0 5px;
  cursor: pointer;
`;
