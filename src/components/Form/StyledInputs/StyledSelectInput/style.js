// @flow
import { css } from 'react-emotion';
import { colors, transitions, fontSizes, presets } from 'styles/common';
import { StyledInputWrapperStyle, StyledInputStyle } from 'components/Form/StyledInputs/style';

export const SelectWrapperStyle = (
  hasError: boolean,
  isOpen: boolean,
  forceHoverStyle: boolean,
  width: string,
  height: string,
  disabled: boolean
) => css`
  cursor: pointer;
  ${StyledInputWrapperStyle(isOpen, hasError, disabled, forceHoverStyle, width, height)};
`;

export const InputStyle = css`
  ${StyledInputStyle};
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
  color: ${isOpen ? colors.TEAL : colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  &:hover,
  :focus {
    color: ${colors.TEAL};
  }
`;
