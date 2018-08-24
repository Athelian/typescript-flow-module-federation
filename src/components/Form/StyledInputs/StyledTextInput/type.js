// @flow
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';
import {
  type PureTextInputProps,
  defaultPureTextInputProps,
} from 'components/Form/PureInputs/PureTextInput/type';

type OptionalProps = {
  pureTextInputOptions: PureTextInputProps,
};

export type StyledTextInputProps = StyledInputProps & OptionalProps & {};

export const defaultStyledTextInputProps = {
  ...defaultStyledInputProps,
  pureTextInputOptions: defaultPureTextInputProps,
};

export default defaultStyledInputProps;
