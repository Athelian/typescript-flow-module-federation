// @flow
import { css } from 'react-emotion';
import { presets } from 'styles/common';

export const CardStyle = (disabled: boolean, selected: boolean, selectable: boolean) => css`
  width: min-content;
  height: min-content;
  ${presets.BOX};
  box-shadow: ${selectable && !disabled && selected
    ? '0 5px 15px rgba(17, 209, 166, 0.5)'
    : '0 10px 30px rgba(0,0,0,0.1)'};
  transition: all 0.2s linear;
  position: relative;
  ${selectable && 'cursor: pointer'};
  ${disabled && 'cursor: not-allowed'};

  &:hover {
    box-shadow: ${selected
      ? '0 10px 30px rgba(17, 209, 166, 0.5)'
      : '0 10px 15px rgba(0, 0, 0, 0.3)'};
    ${disabled && 'box-shadow: 0 10px 30px rgba(0,0,0,0.1)'};
  }
`;

export const SelectableCardStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
