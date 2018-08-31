// @flow
import {
  type PureTextInputProps,
  defaultPureTextInputProps,
} from 'components/Form/PureInputs/PureTextInput/type';
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';

type OptionalProps = StyledInputProps & {
  pureInputOptions: PureTextInputProps,
};

export type StyledPasswordInputProps = OptionalProps;

export const defaultStyledPasswordInputProps = {
  ...defaultStyledInputProps,
  pureInputOptions: defaultPureTextInputProps,
};

export default defaultStyledPasswordInputProps;
