// @flow
import * as React from 'react';
import EnumProvider from 'providers/enum';
import SearchSelectInput from 'components/Form/SearchSelectInput';
import matchSorter from 'match-sorter';
import Label from 'components/Label';
import type { LabelProps } from 'components/Label/type.js.flow';
import { StringValue } from 'react-values';

type Props = LabelProps & {
  value: any,
  onChange: any => void,
  enumType: string,
  hasHoverStyle: boolean,
  width?: ?number,
};

function EnumInput({ value, onChange, enumType, hasHoverStyle, width, ...labelProps }: Props) {
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
                  error={labelProps.error}
                  hasHoverStyle={hasHoverStyle}
                  width={width}
                />
              </Label>
            )}
          </StringValue>
        );
      }}
    </EnumProvider>
  );
}

export default EnumInput;
