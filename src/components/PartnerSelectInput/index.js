// @flow
import React from 'react';
import PartnerListProvider from 'providers/PartnerList';
import SelectInput from 'components/Form/SelectInput';
import Label from 'components/Label';
import type { LabelProps } from 'components/Label/type.js.flow';
import { ErrorTooltip, WarningTooltip, InfoTooltip } from 'components/Tooltips';

type Props = LabelProps & {
  value: any,
  onChange: any => void,
  types?: Array<string>,
};

const defaultPartnerTypes = ['Exporter', 'Supplier', 'Forwarder'];

function PartnerSelectInput({
  value,
  onChange,
  types = defaultPartnerTypes,
  info,
  error,
  warning,
  title,
  required,
  hideLabel,
}: Props) {
  return (
    <PartnerListProvider>
      {({ data, loading }) => (
        <Label title={title} htmlFor={value} hideLabel={hideLabel}>
          {info && <InfoTooltip info={info} />}
          {required && ' * '}
          <SelectInput
            value={value}
            items={data.filter(item => types.includes(item.type))}
            onChange={onChange}
            loading={loading}
            itemToString={item => (item ? item.name : '')}
            itemToValue={item => (item ? item.id : null)}
          />
          {error && <ErrorTooltip error={error} />}
          {warning && <WarningTooltip warning={warning} />}
        </Label>
      )}
    </PartnerListProvider>
  );
}

export default PartnerSelectInput;
