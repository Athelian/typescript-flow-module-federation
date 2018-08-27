// @flow
import { type PureInputProps, defaultPureInputProps } from 'components/Form/PureInputs/type';

type OptionalProps = PureInputProps & {};

export type PureNumberInputProps = OptionalProps & {};

export const defaultPureNumberInputProps = {
  ...defaultPureInputProps,
};

export default defaultPureNumberInputProps;
