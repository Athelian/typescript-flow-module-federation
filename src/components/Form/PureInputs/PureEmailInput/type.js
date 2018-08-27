// @flow
import { type PureInputProps, defaultPureInputProps } from 'components/Form/PureInputs/type';

type OptionalProps = PureInputProps & {};

export type PureEmailInputProps = OptionalProps & {};

export const defaultPureEmailInputProps = {
  ...defaultPureInputProps,
};

export default defaultPureEmailInputProps;
