// @flow
import {
  type PureInputOptionalProps,
  defaultPureInputProps,
} from 'components/Form/PureInputs/type';

type OptionalProps = PureInputOptionalProps & {};

export type PureNumberInputProps = OptionalProps & {};

export const defaultPureNumberInputProps = {
  ...defaultPureInputProps,
};

export default defaultPureNumberInputProps;
