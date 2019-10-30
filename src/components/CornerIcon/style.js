// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, layout } from 'styles/common';

export const WrapperStyle = css`
  position: relative;
  overflow: hidden;
  width: 25px;
  height: 25px;
`;

export const CornerIconStyle = (color: string) => css`
  ${layout.LAYOUT};
  ${layout.CENTER_CENTER};
  ${fontSizes.SMALL};
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  color: ${colors.WHITE};
  background: ${color};
  box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.15);
  border-radius: 0 5px 0 5px;
  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: 20px;
    width: 10px;
    height: 10px;
    border-radius: 0 5px 0 0;
    box-shadow: 5px 0 0 0 ${color};
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
    box-shadow: 5px 0 0 0 ${color};
  }
`;
