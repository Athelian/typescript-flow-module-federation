// @flow
import { css } from 'react-emotion';
import { colors, layout, fontSizes, borderRadiuses } from 'styles/common';

export const IconStyle = (color: string, invert: boolean): string => css`
  position: relative;
  background: ${invert ? colors.WHITE : colors[color]};
  color: ${invert ? colors[color] : colors.WHITE};
  display: flex;
  ${layout.CENTER_CENTER};
  width: 50px;
  height: 50px;
  ${fontSizes.HUGE};
`;

export const SubIconStyle = (color: string, invert: boolean): string => css`
  position: absolute;
  bottom: 5px;
  right: -10px;
  color: ${invert ? colors[color] : 'rgba(255, 255, 255, 0.75)'};
  background-color: ${invert ? colors.WHITE : colors[color]};
  ${fontSizes.SMALL};
  width: 22px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${borderRadiuses.MAIN};
  z-index: 2;
`;
