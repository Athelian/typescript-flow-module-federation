// @flow
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';
import {
  type PureTextInputProps,
  defaultPureTextInputProps,
} from 'components/Form/PureInputs/PureTextInput/type';

type OptionalProps = StyledInputProps & {
  pureInputOptions: PureTextInputProps,
};

export type StyledTextAreaInputProps = OptionalProps;

export const defaultStyledTextAreaInputProps = {
  ...defaultStyledInputProps,
  pureInputOptions: defaultPureTextInputProps,
};

export default defaultStyledTextAreaInputProps;
