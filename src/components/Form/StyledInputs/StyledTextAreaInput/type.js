// @flow
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';
import {
  type PureTextAreaInputProps,
  defaultPureTextAreaInputProps,
} from 'components/Form/PureInputs/PureTextAreaInput/type';

type OptionalProps = StyledInputProps & {
  pureInputOptions: PureTextAreaInputProps,
};

export type StyledTextAreaInputProps = OptionalProps;

export const defaultStyledTextAreaInputProps = {
  ...defaultStyledInputProps,
  pureInputOptions: defaultPureTextAreaInputProps,
};

export default defaultStyledTextAreaInputProps;
