// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import matchSorter from 'match-sorter';
import EnumProvider from 'providers/enum';
import { SearchSelectInput, DefaultSearchSelect, DefaultOptions } from 'components/Form';
import logger from 'utils/logger';

const filterItems = (query: string, items: Array<any>) => {
  if (!query) return items;
  return matchSorter(items, query, {
    keys: ['name', 'description'],
  });
};

export function textInputFactory() {}
export function dateInputFactory() {}
export function numberInputFactory() {}

export function enumSelectInputFactory({
  enumType,
  inputHandlers,
  name,
  touched,
  errors,
  isNew,
  activeField,
}: {
  enumType: string,
  inputHandlers: Object,
  name: string,
  touched: Object,
  errors: Object,
  isNew: boolean,
  activeField: Function,
}) {
  return (
    <EnumProvider enumType={enumType}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return `Error!: ${error}`;
        return (
          <StringValue
            defaultValue={inputHandlers.value}
            onChange={newValue =>
              inputHandlers.onChange({
                target: {
                  value: newValue || '',
                },
              })
            }
          >
            {({ value: query, set, clear }) => (
              <SearchSelectInput
                name={name}
                {...inputHandlers}
                items={filterItems(query, data)}
                itemToString={item => (item ? item.name : '')}
                itemToValue={item => (item ? item.name : '')}
                renderSelect={({ ...rest }) => (
                  <DefaultSearchSelect
                    {...rest}
                    hasError={touched[name] && errors[name]}
                    forceHoverStyle={isNew}
                    width="200px"
                    isOpen={activeField === name}
                  />
                )}
                renderOptions={({ ...rest }) => (
                  <DefaultOptions
                    {...rest}
                    items={filterItems(query, data)}
                    itemToString={item => (item ? item.name : '')}
                    itemToValue={item => (item ? item.name : '')}
                  />
                )}
                onChange={item => {
                  logger.warn('SearchSelectInput onChange', item);
                  if (!item) clear();
                  set(item && item.name);
                }}
                onSearch={set}
              />
            )}
          </StringValue>
        );
      }}
    </EnumProvider>
  );
}
