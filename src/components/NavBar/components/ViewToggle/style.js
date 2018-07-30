// @flow
import { css } from 'react-emotion';
import { presets, colors, transitions } from 'styles/common';

export const ViewToggleWrapperStyle = css`
  display: flex;
  height: min-content;
`;

export const ViewButtonStyle = (isActive: boolean, color: string = 'BLUE') => css`
  ${presets.BUTTON};
  color: ${isActive ? colors[color] : colors.GRAY_LIGHT};
  font-size: 20px;
  padding: 5px 2.5px;
  ${transitions.MAIN};
  outline: none;
  &:hover {
    transform: translateY(-1px);
  }
`;
