// @flow
import * as React from 'react';
import matchSorter from 'match-sorter';
import PartnerListProvider from 'providers/PartnerList';
import { StringValue } from 'react-values';
import SearchSelectInput from '../index';
import { type PartnerSelectInputProps as Props, defaultPartnerSelectInputProps } from './type';

function PartnerSelectInput({ onChange, types, ...rest }: Props) {
  const filterItems = (query: string, items: Array<any>) => {
    if (!query) return items;
    return matchSorter(items, query, { keys: ['group.name'] });
  };

  return (
    <PartnerListProvider types={types}>
      {({ data, loading }) => (
        <StringValue defaultValue="">
          {({ value: query, set, clear }) => (
            <SearchSelectInput
              pureInputOptions={{
                items: filterItems(query, data),
                itemToString: item => (item ? item.group.name : ''),
                itemToValue: item => (item ? item.id : null),
                onChange: item => {
                  if (!item) clear();
                  if (onChange) onChange(item);
                },
                ...rest,
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
