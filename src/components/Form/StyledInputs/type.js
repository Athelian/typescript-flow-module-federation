// @flow
import { type PureInputProps, defaultPureInputProps } from 'components/Form/PureInputs/type';

export type StyledInputProps = {
  hasError: boolean,
  disabled: boolean,
  forceHoverStyle: boolean,
  width: string,
  pureInputProps: PureInputProps,
};

export const defaultStyledInputProps = {
  hasError: false,
  disabled: false,
  forceHoverStyle: false,
  width: '100%',
  pureInputProps: defaultPureInputProps,
};

export type StyledInputStates = {
  isFocused: boolean,
};

export default defaultStyledInputProps;
