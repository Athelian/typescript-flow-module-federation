// @flow
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';

type OptionalProps = StyledInputProps;

export type StyledPasswordInputProps = OptionalProps & {};

export const defaultStyledPasswordInputProps = {
  ...defaultStyledInputProps,
};

export default defaultStyledPasswordInputProps;
