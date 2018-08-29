// @flow
import { type PureInputProps, defaultPureInputProps } from 'components/Form/PureInputs/type';

type OptionalProps = {
  isFocused: boolean,
  hasError: boolean,
  disabled: boolean,
  forceHoverStyle: boolean,
  width: string,
  height: string,
  pureInputOptions: PureInputProps,
};

export type StyledInputProps = OptionalProps & {};

export const defaultStyledInputProps = {
  isFocused: false,
  hasError: false,
  disabled: false,
  forceHoverStyle: false,
  width: '100%',
  height: '30px',
  pureInputOptions: defaultPureInputProps,
};

export default defaultStyledInputProps;
