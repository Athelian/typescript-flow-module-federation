// @flow
import { css } from 'react-emotion';
import { colors, layout, fontSizes, presets } from 'styles/common';

export const FormWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

export const StatusStyle = (archived: boolean): string => css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  color: ${archived ? colors.GRAY : colors.TEAL};
  align-items: center;
  ${fontSizes.SMALL};
`;

export const StatusLabelStyle: string = css`
  ${presets.ELLIPSIS};
  ${fontSizes.MAIN};
  font-weight: bold;
`;
