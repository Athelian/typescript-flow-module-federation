// @flow
import { css } from 'react-emotion';
import { StyledInputWrapperStyle, StyledInputStyle } from 'components/Form/StyledInputs/style';

export const StyledEmailInputWrapperStyle = (
  isFocused: boolean,
  hasError: boolean,
  disabled: boolean,
  forceHoverStyle: boolean,
  width: string,
  height: string
) => css`
  ${StyledInputWrapperStyle(isFocused, hasError, disabled, forceHoverStyle, width, height)};
`;

export const StyledEmailInputStyle = css`
  ${StyledInputStyle};
`;
