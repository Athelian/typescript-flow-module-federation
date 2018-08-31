// @flow
import * as React from 'react';
import matchSorter from 'match-sorter';
import PartnerListProvider from 'providers/PartnerList';
import { StringValue } from 'react-values';
import SearchSelectInput from '../index';
import { type PartnerSelectInputProps as Props, defaultPartnerSelectInputProps } from './type';

function PartnerSelectInput({ onChange, types, ...rest }: Props) {
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

PartnerSelectInput.defaultProps = defaultPartnerSelectInputProps;
export default PartnerSelectInput;
