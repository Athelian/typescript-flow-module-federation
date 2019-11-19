// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, layout, presets, transitions } from 'styles/common';

export const SelectInputStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  height: 30px;
  & > input {
    ${fontSizes.MAIN};
    ${presets.ELLIPSIS};
    color: ${colors.BLACK};
    background: transparent;
    width: 100%;
    line-height: 18px;
    font-weight: bold;
    &::placeholder {
      color: ${colors.GRAY_LIGHT};
    }
  }
`;

export const ClearButtonStyle: string = css`
  ${presets.BUTTON};
  ${transitions.EXPAND};
  ${fontSizes.SMALL};
  color: ${colors.GRAY_LIGHT};
  height: 100%;
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;

export const ArrowDownStyle = (isOpen: boolean): string => css`
  ${presets.BUTTON};
  ${transitions.EXPAND};
  ${fontSizes.SMALL};
  color: ${isOpen ? colors.TEAL : colors.GRAY_LIGHT};
  height: 100%;
  cursor: pointer;
  &:hover,
  :focus {
    color: ${colors.TEAL};
  }
`;
