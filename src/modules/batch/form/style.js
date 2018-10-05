// @flow
import { css } from 'react-emotion';
import { colors, layout, fontSizes, presets } from 'styles/common';

export const BatchFormWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

export const StatusStyle = (archived: boolean): string => css`
  ${presets.ELLIPSIS};
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  color: ${archived ? colors.GRAY : colors.TEAL};
  ${fontSizes.MAIN};
  font-weight: bold;
  align-items: center;
`;
