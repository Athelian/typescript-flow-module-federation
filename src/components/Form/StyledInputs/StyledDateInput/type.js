// @flow
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';

type OptionalProps = StyledInputProps;

export type StyledDateInputProps = OptionalProps & {};

export const defaultStyledDateInputProps = {
  ...defaultStyledInputProps,
};

export default defaultStyledDateInputProps;
