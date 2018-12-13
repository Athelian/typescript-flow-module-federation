// @flow
import { css } from 'react-emotion';
import { colors, layout, fontSizes, presets } from 'styles/common';

export const EntityHeaderWrapperStyle = css`
  ${layout.HORIZONTAL};
  align-items: center;
  padding: 0 20px;
`;

export const EntityHeaderIconStyle = (color: string) => css`
  ${presets.BUTTON};
  height: 50px;
  width: 50px;
  background-color: ${colors[color]};
  color: ${colors.WHITE};
  ${fontSizes.LARGE};
  margin: 0 10px 0 0;
  &:hover, :focus {
    background-color: ${colors[`${color}_DARK`]};
  }
`;
