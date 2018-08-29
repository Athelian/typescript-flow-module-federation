// @flow
import * as React from 'react';
import EnumProvider from 'providers/enum';
import matchSorter from 'match-sorter';
import { StringValue } from 'react-values';
import SearchSelectInput from '../StyledSearchSelectInput';
import type { EnumInputProps as Props } from './type.js.flow';

function EnumInput({ value, onChange, enumType, ...rest }: Props) {
  const filterItems = (query: string, items: Array<any>) => {
    if (!query) return items;
    return matchSorter(items, query, { keys: ['name', 'description'] });
  };

  return (
    <EnumProvider enumType={enumType}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return `Error!: ${error}`;

        return (
          <StringValue defaultValue="">
            {({ value: query, set, clear }) => (
              <SearchSelectInput
                value={value}
                items={filterItems(query, data)}
                onChange={item => {
                  if (!item) clear();
                  if (onChange) onChange(item);
                }}
                onSearch={set}
                loading={loading}
                itemToString={item => (item ? item.name : '')}
                itemToValue={item => (item ? item.id : null)}
                {...rest}
              />
            )}
          </StringValue>
        );
      }}
    </EnumProvider>
  );
}

export default EnumInput;
