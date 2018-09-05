// @flow
import { css } from 'react-emotion';
import { colors, layout, fontSizes } from 'styles/common';

export const BatchFormWrapperStyle = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;

export const StatusStyle = (archived: boolean) => css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  color: ${archived ? colors.GRAY : colors.TEAL};
  ${fontSizes.MAIN};
  font-weight: bold;
  align-items: center;
`;
