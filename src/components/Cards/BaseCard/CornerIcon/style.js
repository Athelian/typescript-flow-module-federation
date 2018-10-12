// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes, shadows } from 'styles/common';

export const IconStyle = (color: string, disabled: boolean, readOnly: boolean): string => css`
  ${presets.BUTTON};
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  ${fontSizes.SMALL};
  color: ${disabled ? 'rgba(0, 0, 0, 0.25)' : '#fff'};
  background: ${colors[color]};
  cursor: ${readOnly ? 'default' : 'pointer'};
  ${disabled && 'cursor: not-allowed'};
  z-index: 1;
  box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.15);
  border-radius: 0 5px 0 5px;
  &:hover,
  :focus {
    ${shadows.INPUT};
  }
  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: 20px;
    width: 10px;
    height: 10px;
    border-radius: 0 5px 0 0;
    box-shadow: 5px 0 0 0 ${colors[color]};
    z-index: -1;
  }
  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    width: 10px;
    height: 10px;
    border-radius: 0 5px 0 0;
    box-shadow: 0 -5px 0 0 ${colors[color]};
    z-index: -1;
  }
`;

export default IconStyle;
