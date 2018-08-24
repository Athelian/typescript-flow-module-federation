// @flow

type OptionalProps = {
  hasError: boolean,
  disabled: boolean,
  forceHoverStyle: boolean,
  width: string,
};

export type StyledInputProps = OptionalProps & {};

export const defaultStyledInputProps = {
  hasError: false,
  disabled: false,
  forceHoverStyle: false,
  width: '100%',
};

export type StyledInputStates = {
  isFocused: boolean,
};

export default defaultStyledInputProps;
