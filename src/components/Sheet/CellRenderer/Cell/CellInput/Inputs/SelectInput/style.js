// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, presets, transitions } from 'styles/common';

export const SelectInputStyle = css`
  cursor: pointer;
`;

export const ClearButtonStyle: string = css`
  ${presets.BUTTON};
  ${fontSizes.SMALL};
  color: ${colors.GRAY_LIGHT};

  &:hover,
  &:focus {
    color: ${colors.RED};
  }
`;

export const ArrowDownStyle = (isOpen: boolean): string => css`
  ${presets.BUTTON};
  ${transitions.EXPAND};
  ${fontSizes.SMALL};
  color: ${isOpen ? colors.TEAL : colors.GRAY_LIGHT};

  &:hover,
  :focus {
    color: ${colors.TEAL};
  }
`;
