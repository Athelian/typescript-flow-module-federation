// @flow
import React from 'react';
import matchSorter from 'match-sorter';
import PartnerListProvider from 'providers/PartnerList';
import Label from 'components/Label';
import type { LabelProps } from 'components/Label/type.js.flow';
import SearchSelectInput from 'components/Form/SearchSelectInput';
import { StringValue } from 'react-values';

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
  ...labelProps
}: Props) {
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
            <Label htmlFor={value} {...labelProps}>
              <SearchSelectInput
                value={value}
                items={filterItems(query, data)}
                onChange={item => {
                  if (!item) clear();
                  onChange(item);
                }}
                onSearch={set}
                loading={loading}
                itemToString={item => (item ? item.name : '')}
                itemToValue={item => (item ? item.id : null)}
              />
            </Label>
          )}
        </StringValue>
      )}
    </PartnerListProvider>
  );
}

export default PartnerSelectInput;
