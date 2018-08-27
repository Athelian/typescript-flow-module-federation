// @flow
import {
  type PureInputOptionalProps,
  defaultPureInputProps,
} from 'components/Form/PureInputs/type';

type OptionalProps = PureInputOptionalProps & {};

export type PurePasswordInputProps = OptionalProps & {};

export const defaultPurePasswordInputProps = {
  ...defaultPureInputProps,
};

export default defaultPurePasswordInputProps;
