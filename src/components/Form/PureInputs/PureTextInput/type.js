// @flow
import { type PureInputProps, defaultPureInputProps } from 'components/Form/PureInputs/type';

type OptionalProps = PureInputProps;

export type PureTextInputProps = OptionalProps;

export const defaultPureTextInputProps = {
  ...defaultPureInputProps,
};

export default defaultPureTextInputProps;
