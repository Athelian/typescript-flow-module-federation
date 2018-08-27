// @flow
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';

type OptionalProps = StyledInputProps;

export type StyledTextInputProps = OptionalProps & {};

export const defaultStyledTextInputProps = {
  ...defaultStyledInputProps,
};

export default defaultStyledTextInputProps;
