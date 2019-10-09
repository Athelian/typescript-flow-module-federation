// @flow
import { css } from 'react-emotion';
import { layout, presets, colors } from 'styles/common';

export const PortsWrapperStyle = css`
  ${layout.GRID_VERTICAL};
  grid-template-columns: 200px;
  grid-gap: 10px;
`;

export const PortWrapperStyle = css`
  position: relative;

  &:hover > button {
    opacity: 1;
  }
`;

export const RemoveButtonStyle = css`
  ${presets.BUTTON};
  opacity: 0;
  color: rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0;
  right: -30px;
  width: 30px;
  height: 30px;

  &:hover,
  &:focus {
    color: ${colors.RED};
  }
`;
