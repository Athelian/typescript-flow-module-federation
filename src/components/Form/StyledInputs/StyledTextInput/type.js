// @flow
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';
import {
  type PureTextInputProps,
  defaultPureTextInputProps,
} from 'components/Form/PureInputs/PureTextInput/type';

type OptionalProps = StyledInputProps & {
  pureInputOptions: PureTextInputProps,
};

export type StyledTextInputProps = OptionalProps;

export const defaultStyledTextInputProps = {
  ...defaultStyledInputProps,
  pureInputOptions: defaultPureTextInputProps,
};

export default defaultStyledTextInputProps;
