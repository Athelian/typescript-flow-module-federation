// @flow
import { css } from 'react-emotion';
import { presets, colors, borderRadiuses } from 'styles/common';

export const CardActionStyle = (hoverColor: string): string => css`
  ${presets.BUTTON};
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.25);
  color: ${colors.WHITE};
  font-size: 11px;
  ${borderRadiuses.CIRCLE};
  flex-shrink: 0;
  &:hover {
    background-color: ${colors[hoverColor]};
  }
  outline: none;
`;

export default CardActionStyle;
