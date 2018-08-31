// @flow
import {
  type PurePasswordInputProps,
  defaultPurePasswordInputProps,
} from 'components/Form/PureInputs/PurePasswordInput/type';
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';

type OptionalProps = StyledInputProps & {
  pureInputOptions: PurePasswordInputProps,
};

export type StyledPasswordInputProps = OptionalProps;

export const defaultStyledPasswordInputProps = {
  ...defaultStyledInputProps,
  pureInputOptions: defaultPurePasswordInputProps,
};

export default defaultStyledPasswordInputProps;
