// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, layout, presets, transitions } from 'styles/common';

export const SelectInputWrapperStyle = (color: string): string => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  background-color: ${color || colors.WHITE};
  width: 100%;
  height: 30px;
  padding: 0 5px;
`;

export const SelectInputStyle = (textColor: string): string => css`
  ${fontSizes.MAIN};
  ${presets.ELLIPSIS};
  color: ${textColor || colors.BLACK};
  text-align: left;
  font-weight: bold;
  flex: 1;
  cursor: pointer;
`;

export const ArrowDownStyle: string = css`
  ${presets.BUTTON};
  ${transitions.EXPAND};
  ${fontSizes.SMALL};
  color: rgba(0, 0, 0, 0.1);
  height: 100%;
  cursor: pointer;
  &:hover,
  :focus {
    color: ${colors.TEAL};
  }
`;

export const OptionStyle = (color: string, textColor: string): string => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  ${fontSizes.MAIN};
  ${presets.ELLIPSIS};
  color: ${textColor || colors.BLACK};
  background-color: ${color || colors.WHITE};
  width: 100%;
  height: 100%;
  font-weight: bold;
  padding: 0 5px;
  cursor: pointer;
  ${transitions.MAIN};
`;
