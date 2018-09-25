// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import matchSorter from 'match-sorter';
import EnumProvider from 'providers/enum';
import {
  FieldItem,
  Label,
  Tooltip,
  SearchSelectInput,
  DefaultSearchSelect,
  DefaultOptions,
} from 'components/Form';
import logger from 'utils/logger';

const filterItems = (query: string, items: Array<any>) => {
  if (!query) return items;
  return matchSorter(items, query, {
    keys: ['name', 'description'],
  });
};

export const parseEnumValue = (enumValue: ?string | ?{ name: string }) => {
  if (enumValue && enumValue.name) return enumValue.name;
  return enumValue;
};

export const parseEnumDescription = (enumValue: ?string | ?{ description: string }) => {
  if (enumValue && enumValue.description) return enumValue.description;
  return enumValue;
};

export default function selectSearchEnumInputFactory({
  required = false,
  width = '200px',
  enumType,
  inputHandlers,
  name,
  isNew,
  label,
  initValue,
}: {
  enumType: string,
  required?: boolean,
  width?: string,
  isNew: boolean,
  label?: React.Node,
  name: string,
  inputHandlers: Object,
  initValue: any,
}) {
  return (
    <FieldItem
      label={
        label && (
          <Label required={required} width={width}>
            {label}
          </Label>
        )
      }
      tooltip={
        <Tooltip
          isNew={isNew}
          errorMessage={inputHandlers.isTouched && inputHandlers.errorMessage}
          changedValues={{
            oldValue: parseEnumDescription(initValue),
            newValue: parseEnumDescription(inputHandlers.value),
          }}
        />
      }
      input={
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
                    itemToString={item => (item ? item.description || item.name : '')}
                    itemToValue={item => (item ? item.name : '')}
                    renderSelect={({ ...rest }) => (
                      <DefaultSearchSelect
                        {...rest}
                        hasError={inputHandlers.isTouched && inputHandlers.errorMessage}
                        forceHoverStyle={isNew}
                        width={width}
                        isOpen={inputHandlers.isFocused}
                        itemToString={item => (item ? item.description || item.name : '')}
                      />
                    )}
                    renderOptions={({ ...rest }) => (
                      <DefaultOptions
                        {...rest}
                        items={filterItems(query, data)}
                        itemToString={item => (item ? item.description || item.name : '')}
                        itemToValue={item => (item ? item.name : '')}
                        width={width}
                      />
                    )}
                    onChange={item => {
                      logger.warn('SearchSelectInput onChange', item);
                      if (!item) clear();
                      set(item);
                    }}
                    onSearch={set}
                  />
                )}
              </StringValue>
            );
          }}
        </EnumProvider>
      }
    />
  );
}
