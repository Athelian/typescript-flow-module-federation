// @flow
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';
import {
  type PureTextInputProps,
  defaultPureTextInputProps,
} from 'components/Form/PureInputs/PureTextInput/type';

type OptionalProps = {
  pureTextInputProps: PureTextInputProps,
};

export type StyledTextInputProps = StyledInputProps & OptionalProps & {};

export const defaultStyledTextInputProps = {
  ...defaultStyledInputProps,
  pureTextInputProps: defaultPureTextInputProps,
};

export default defaultStyledInputProps;
