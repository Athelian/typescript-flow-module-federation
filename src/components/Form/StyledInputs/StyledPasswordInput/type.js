// @flow
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';
import {
  type PurePasswordInputProps,
  defaultPurePasswordInputProps,
} from 'components/Form/PureInputs/PurePasswordInput/type';

type OptionalProps = {
  purePasswordInputOptions: PurePasswordInputProps,
};

export type StyledPasswordInputProps = StyledInputProps & OptionalProps & {};

export const defaultStyledPasswordInputProps = {
  ...defaultStyledInputProps,
  purePasswordInputOptions: defaultPurePasswordInputProps,
};

export default defaultStyledPasswordInputProps;
