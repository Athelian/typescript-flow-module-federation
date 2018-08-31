// @flow
import {
  type PureEmailInputProps,
  defaultPureEmailInputProps,
} from 'components/Form/PureInputs/PureEmailInput/type';
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';

type OptionalProps = StyledInputProps & {
  pureInputOptions: PureEmailInputProps,
};

export type StyledEmailInputProps = OptionalProps;

export const defaultStyledEmailInputProps = {
  ...defaultStyledInputProps,
  pureInputOptions: defaultPureEmailInputProps,
};

export default defaultStyledEmailInputProps;
