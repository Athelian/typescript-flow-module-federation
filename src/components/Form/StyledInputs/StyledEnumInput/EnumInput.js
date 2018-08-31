// @flow
import * as React from 'react';
import EnumProvider from 'providers/enum';
import matchSorter from 'match-sorter';
import { StringValue } from 'react-values';
import { defaultPureInputProps } from 'components/Form/PureInputs/type';
import SearchSelectInput from '../StyledSelectInput/StyledSearchSelectInput';
import type { EnumInputProps as Props } from './type';

function EnumInput({ enumType, pureInputOptions, ...rest }: Props) {
  const { onChange } = pureInputOptions;
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
                onChange={item => {
                  if (!item) clear();
                  if (onChange) onChange(item);
                }}
                onSearch={set}
                loading={loading}
                pureInputOptions={{
                  items: filterItems(query, data),
                  itemToString: item => (item ? item.name : ''),
                  itemToValue: item => (item ? item.id : null),
                  ...pureInputOptions,
                  ...rest,
                }}
              />
            )}
          </StringValue>
        );
      }}
    </EnumProvider>
  );
}

EnumInput.defaultProps = defaultPureInputProps;

export default EnumInput;
