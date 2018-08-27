// @flow
import { type PureInputProps, defaultPureInputProps } from 'components/Form/PureInputs/type';

type OptionalProps = PureInputProps & {};

export type PurePasswordInputProps = OptionalProps & {};

export const defaultPurePasswordInputProps = {
  ...defaultPureInputProps,
};

export default defaultPurePasswordInputProps;
