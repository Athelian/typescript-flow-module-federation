// @flow
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';

type OptionalProps = StyledInputProps;

export type StyledNumberInputProps = OptionalProps & {};

export const defaultStyledNumberInputProps = {
  ...defaultStyledInputProps,
};

export default defaultStyledNumberInputProps;
