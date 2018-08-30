// @flow
import { type PureInputProps, defaultPureInputProps } from 'components/Form/PureInputs/type';

type OptionalProps = PureInputProps & {};

export type PureTextAreaInputProps = OptionalProps & {};

export const defaultPureTextAreaInputProps = {
  ...defaultPureInputProps,
};

export default defaultPureTextAreaInputProps;
