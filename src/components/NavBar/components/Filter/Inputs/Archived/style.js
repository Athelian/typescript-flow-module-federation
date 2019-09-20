// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, layout, presets } from 'styles/common';

export const StatusStyle = (archived: boolean): string => css`
  ${presets.ELLIPSIS};
  ${layout.GRID_HORIZONTAL};
  ${fontSizes.MAIN};
  color: ${archived ? colors.GRAY : colors.TEAL};
  align-items: center;
  height: 30px;
  grid-gap: 5px;
  font-weight: bold;
`;
