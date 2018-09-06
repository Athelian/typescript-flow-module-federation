// @flow
import { css } from 'react-emotion';
import { colors, transitions, fontSizes, presets } from 'styles/common';

export const SelectInputStyle = (align: 'left' | 'right' | 'center') => css`
  cursor: pointer;
  text-align: ${align};
`;

export const ClearButtonStyle = css`
  ${presets.BUTTON};
  height: 100%;
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;

export const ArrowDownStyle = (isOpen: boolean) => css`
  ${presets.BUTTON};
  ${transitions.EXPAND};
  transform: rotate(${isOpen ? '180' : '0'}deg);
  height: 100%;
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
