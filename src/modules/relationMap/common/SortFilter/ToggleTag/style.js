// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, layout } from 'styles/common';

export const ToggleTagWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  align-items: center;
  width: 100%;
  justify-content: end;
`;

export const ToggleTagIconStyle: string = css`
  ${fontSizes.SMALL};
  color: ${colors.GRAY_LIGHT};
`;
