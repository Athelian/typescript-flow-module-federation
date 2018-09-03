// @flow
import { css } from 'react-emotion';
import { colors, transitions, fontSizes, presets } from 'styles/common';

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
  color: ${isOpen ? colors.TEAL : colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  &:hover,
  :focus {
    color: ${colors.TEAL};
  }
`;
