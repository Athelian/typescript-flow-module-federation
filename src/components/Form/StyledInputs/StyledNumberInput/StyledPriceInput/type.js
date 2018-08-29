// @flow
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';

type OptionalProps = StyledInputProps & {
  currency: string,
};

export type StyledPriceInputProps = OptionalProps & {};

export const defaultStyledPriceInputProps = {
  ...defaultStyledInputProps,
  currency: '',
};

export default defaultStyledPriceInputProps;
