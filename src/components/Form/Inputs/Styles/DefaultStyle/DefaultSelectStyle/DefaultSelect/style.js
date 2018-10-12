// @flow
import { css } from 'react-emotion';
import { colors, transitions, fontSizes, presets } from 'styles/common';

export const SelectInputStyle = (align: 'left' | 'right' | 'center'): string => css`
  cursor: pointer;
  text-align: ${align};
`;

export const ClearButtonStyle: string = css`
  ${presets.BUTTON};
  height: 100%;
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  opacity: 0;
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;

export const ArrowDownStyle = (isOpen: boolean): string => css`
  ${presets.BUTTON};
  ${transitions.EXPAND};
  height: 100%;
  opacity: 0;
  cursor: pointer;
  ${isOpen
    ? `
    color: ${colors.TEAL};
    opacity: 1;
  `
    : `
    color: ${colors.GRAY_LIGHT};
    opacity: 0;
  `};
  ${fontSizes.SMALL};
  &:hover,
  :focus {
    color: ${colors.TEAL};
  }
`;
