// @flow
import {
  type PureNumberInputProps,
  defaultPureNumberInputProps,
} from 'components/Form/PureInputs/PureNumberInput/type';
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';

type OptionalProps = StyledInputProps & {
  currency: string,
  pureInputOptions: PureNumberInputProps,
};

export type StyledPriceInputProps = OptionalProps;

export const defaultStyledPriceInputProps = {
  ...defaultStyledInputProps,
  currency: '',
  pureInputOptions: defaultPureNumberInputProps,
};

export default defaultStyledPriceInputProps;
