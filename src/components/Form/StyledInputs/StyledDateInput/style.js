// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';
import { StyledInputWrapperStyle, StyledInputStyle } from 'components/Form/StyledInputs/style';

export const StyledDateInputWrapperStyle = (
  isFocused: boolean,
  hasError: boolean,
  disabled: boolean,
  forceHoverStyle: boolean,
  width: string,
  height: string
) => css`
  ${StyledInputWrapperStyle(isFocused, hasError, disabled, forceHoverStyle, width, height)};
`;

export const StyledDateInputStyle = (value: ?any) => css`
  ${StyledInputStyle};
  &::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ${!value && `color: ${colors.GRAY_VERY_LIGHT}`};
`;
