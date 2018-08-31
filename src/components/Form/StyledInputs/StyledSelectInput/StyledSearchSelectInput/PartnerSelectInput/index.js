// @flow
import * as React from 'react';
import matchSorter from 'match-sorter';
import PartnerListProvider from 'providers/PartnerList';
import { StringValue } from 'react-values';
import { type PureInputProps } from 'components/Form/PureInputs/type';
import SearchSelectInput from '../index';

type Props = PureInputProps & {
  types?: Array<string>,
};

const defaultPartnerTypes = ['Exporter', 'Supplier', 'Forwarder'];

function PartnerSelectInput({ onChange, types = defaultPartnerTypes, ...rest }: Props) {
  const filterItems = (query: string, data: Array<any>) => {
    const items = data.filter(item => types.includes(item.type));
    if (!query) return items;
    return matchSorter(items, query, { keys: ['name'] });
  };

  return (
    <PartnerListProvider>
      {({ data, loading }) => (
        <StringValue defaultValue="">
          {({ value: query, set, clear }) => (
            <SearchSelectInput
              pureInputOptions={{
                items: filterItems(query, data),
                itemToString: item => (item ? item.name : ''),
                itemToValue: item => (item ? item.id : null),
                onChange,
                ...rest,
              }}
              onChange={item => {
                if (!item) clear();
                if (onChange) onChange(item);
              }}
              onSearch={set}
              loading={loading}
            />
          )}
        </StringValue>
      )}
    </PartnerListProvider>
  );
}

export default PartnerSelectInput;
