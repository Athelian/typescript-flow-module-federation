// @flow
import {
  type PureInputOptionalProps,
  defaultPureInputProps,
} from 'components/Form/PureInputs/type';

type OptionalProps = PureInputOptionalProps & {};

export type PureTextInputProps = OptionalProps & {};

export const defaultPureTextInputProps = {
  ...defaultPureInputProps,
};

export default defaultPureTextInputProps;
