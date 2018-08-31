// @flow
import {
  type PureNumberInputProps,
  defaultPureNumberInputProps,
} from 'components/Form/PureInputs/PureNumberInput/type';
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';

type OptionalProps = StyledInputProps & {
  pureInputOptions: PureNumberInputProps,
};

export type StyledNumberInputProps = OptionalProps;

export const defaultStyledNumberInputProps = {
  ...defaultStyledInputProps,
  pureInputOptions: defaultPureNumberInputProps,
};

export default defaultStyledNumberInputProps;
