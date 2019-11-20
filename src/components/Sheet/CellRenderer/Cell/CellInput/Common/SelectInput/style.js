// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, layout, presets, transitions } from 'styles/common';

export const SelectInputWrapperStyle: string = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  width: 100%;
  height: 30px;
  padding: 0 5px;
`;

export const SelectInputStyle = (hasValue: boolean): string => css`
  ${fontSizes.MAIN};
  ${presets.ELLIPSIS};
  color: ${hasValue ? colors.BLACK : colors.GRAY_LIGHT};
  text-align: left;
  font-weight: bold;
  flex: 1;
  cursor: pointer;
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
