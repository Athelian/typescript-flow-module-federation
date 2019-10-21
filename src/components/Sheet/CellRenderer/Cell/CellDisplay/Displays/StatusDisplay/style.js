// @flow
import { css } from 'react-emotion';
import { presets, layout, colors, fontSizes } from 'styles/common';

export const StatusDisplayWrapperStyle = (isArchived: boolean): string => css`
  ${presets.ELLIPSIS};
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  color: ${isArchived ? colors.GRAY : colors.TEAL};
  ${fontSizes.MAIN};
  font-weight: bold;
  align-items: center;
  height: 30px;
  padding: 0 5px;
`;

export const InfoIconStyle: string = css`
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  color: ${colors.GRAY};
  z-index: 1;
  &:hover,
  :focus {
    color: ${colors.GRAY_DARK};
  }
`;
