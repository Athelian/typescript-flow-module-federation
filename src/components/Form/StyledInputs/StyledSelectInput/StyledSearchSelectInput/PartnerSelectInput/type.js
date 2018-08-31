// @flow
import { type PureInputProps } from 'components/Form/PureInputs/type';

type OptionalProps = PureInputProps & {
  types: Array<string>,
};

export type PartnerSelectInputProps = OptionalProps;

export const defaultPartnerSelectInputProps = {
  types: ['Exporter', 'Supplier', 'Forwarder'],
};

export default defaultPartnerSelectInputProps;
