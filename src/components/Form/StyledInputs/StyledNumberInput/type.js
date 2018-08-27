// @flow
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';
import {
  type PureNumberInputProps,
  defaultPureNumberInputProps,
} from 'components/Form/PureInputs/PureNumberInput/type';

type OptionalProps = {
  pureNumberInputOptions: PureNumberInputProps,
};

export type StyledNumberInputProps = StyledInputProps & OptionalProps & {};

export const defaultStyledNumberInputProps = {
  ...defaultStyledInputProps,
  pureNumberInputOptions: defaultPureNumberInputProps,
};

export default defaultStyledNumberInputProps;
