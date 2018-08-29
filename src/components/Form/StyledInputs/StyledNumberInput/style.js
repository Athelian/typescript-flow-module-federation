// @flow
import { css } from 'react-emotion';
import { StyledInputWrapperStyle, StyledInputStyle } from 'components/Form/StyledInputs/style';

export const StyledNumberInputWrapperStyle = (
  isFocused: boolean,
  hasError: boolean,
  disabled: boolean,
  forceHoverStyle: boolean,
  width: string,
  height: string
) => css`
  ${StyledInputWrapperStyle(isFocused, hasError, disabled, forceHoverStyle, width, height)};
`;

export const StyledNumberInputStyle = css`
  ${StyledInputStyle};
  &::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
