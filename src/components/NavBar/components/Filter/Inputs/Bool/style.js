// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, layout, presets } from 'styles/common';

export const StatusStyle = (active: boolean): string => css`
  ${presets.ELLIPSIS};
  ${layout.GRID_HORIZONTAL};
  ${fontSizes.MAIN};
  color: ${active ? colors.TEAL : colors.GRAY};
  align-items: center;
  height: 30px;
  grid-gap: 5px;
  font-weight: bold;
`;
