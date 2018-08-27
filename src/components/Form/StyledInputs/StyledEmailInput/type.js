// @flow
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';

type OptionalProps = StyledInputProps;

export type StyledEmailInputProps = OptionalProps & {};

export const defaultStyledEmailInputProps = {
  ...defaultStyledInputProps,
};

export default defaultStyledEmailInputProps;
