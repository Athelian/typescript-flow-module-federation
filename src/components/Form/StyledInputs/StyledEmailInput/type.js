// @flow
import {
  type PureTextInputProps,
  defaultPureTextInputProps,
} from 'components/Form/PureInputs/PureTextInput/type';
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';

type OptionalProps = StyledInputProps & {
  pureInputOptions: PureTextInputProps,
};

export type StyledEmailInputProps = OptionalProps;

export const defaultStyledEmailInputProps = {
  ...defaultStyledInputProps,
  pureInputOptions: defaultPureTextInputProps,
};

export default defaultStyledEmailInputProps;
