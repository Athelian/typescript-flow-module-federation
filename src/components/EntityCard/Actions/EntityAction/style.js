// @flow
import { css } from 'react-emotion';
import { presets, colors, borderRadiuses, shadows } from 'styles/common';

export const ButtonStyle = (hoverColor: string) => css`
  ${presets.BUTTON};
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
  font-size: 12px;
  ${borderRadiuses.CIRCLE};
  flex-shrink: 0;
  &:hover {
    background-color: ${colors[hoverColor]};
  }
  outline: none;
  ${shadows.TOOLTIP};
`;

export default ButtonStyle;
