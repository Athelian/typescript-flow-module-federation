// @flow
import { type PureInputProps } from 'components/Form/PureInputs/type';
import { type PureSearchSelectInputProps } from 'components/Form/PureInputs/PureSearchSelectInput/type';

type OptionalProps = PureInputProps & {
  types: Array<string>,
};

export type PartnerSelectInputProps = OptionalProps & {
  pureInputOptions: PureSearchSelectInputProps,
};

export const defaultPartnerSelectInputProps = {
  types: ['Exporter', 'Importer', 'Supplier', 'Forwarder', 'Warehouse'],
};

export default defaultPartnerSelectInputProps;
