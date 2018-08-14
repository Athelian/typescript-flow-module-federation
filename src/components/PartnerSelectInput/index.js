// @flow
import React from 'react';
import PartnerListProvider from 'providers/PartnerList';
import SelectInput from 'components/Form/SelectInput';

type Props = {
  value: any,
  onChange: any => void,
  types?: Array<string>,
};

const defaultPartnerTypes = ['Exporter', 'Supplier', 'Forwarder'];

const defaultProps = {
  types: defaultPartnerTypes,
};

function PartnerSelectInput({ value, onChange, types = defaultPartnerTypes }: Props) {
  return (
    <PartnerListProvider>
      {({ data, loading }) => (
        <SelectInput
          value={value}
          items={data.filter(item => types.includes(item.type))}
          onChange={onChange}
          loading={loading}
          itemToString={item => (item ? item.name : '')}
          itemToValue={item => (item ? item.id : null)}
        />
      )}
    </PartnerListProvider>
  );
}

PartnerSelectInput.defaultProps = defaultProps;

export default PartnerSelectInput;
