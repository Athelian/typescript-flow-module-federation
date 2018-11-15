// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import matchSorter from 'match-sorter';
import EnumProvider from 'providers/enum';
import {
  FieldItem,
  Label,
  FormTooltip,
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

export const parseEnumDescriptionOrValue = (
  enumValue: ?string | ?{ description: string, name: string }
) => {
  if (enumValue && enumValue.description) return enumValue.description;
  return parseEnumValue(enumValue);
};

export default function selectSearchEnumInputFactory({
  required = false,
  width = '200px',
  enumType,
  inputHandlers,
  name,
  isNew,
  label,
  originalValue,
}: {
  enumType: string,
  required?: boolean,
  width?: string,
  isNew: boolean,
  label?: React.Node,
  name: string,
  inputHandlers: {
    name: string,
    value: string,
    isTouched: boolean,
    errorMessage: string,
    isFocused: boolean,
    onChange: Function,
    onFocus: Function,
    onBlur: Function,
  },
  originalValue: any,
}) {
  return (
    <EnumProvider enumType={enumType}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return `Error!: ${error}`;

        const selectedItem = data.find(item => item.name === inputHandlers.value);
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
              <FormTooltip
                isNew={isNew}
                errorMessage={inputHandlers.isTouched && inputHandlers.errorMessage}
                changedValues={{
                  oldValue: parseEnumDescriptionOrValue(
                    data.find(item => item.name === originalValue)
                  ),
                  newValue: parseEnumDescriptionOrValue(selectedItem),
                }}
              />
            }
            input={
              <StringValue value={parseEnumDescriptionOrValue(selectedItem) || inputHandlers.value}>
                {({ value: query }) => (
                  <SearchSelectInput
                    {...inputHandlers}
                    name={name}
                    items={filterItems(query, data)}
                    itemToString={item => (item ? item.description || item.name : '')}
                    itemToValue={item => (item ? item.name : '')}
                    inputValue={query}
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
                    afterClearSelection={() => {
                      logger.warn('afterClearSelection');
                      inputHandlers.onChange({
                        target: {
                          value: '',
                        },
                      });
                      setTimeout(() => {
                        inputHandlers.onBlur();
                        inputHandlers.onFocus();
                      }, 0);
                    }}
                    onBlur={() => {
                      logger.warn('SearchSelectInput onBlur', inputHandlers.value);
                      if (data.find(item => item.name === inputHandlers.value)) {
                        inputHandlers.onBlur();
                      } else {
                        inputHandlers.onChange({
                          target: {
                            value: '',
                          },
                        });
                        setTimeout(() => {
                          inputHandlers.onBlur();
                        }, 0);
                      }
                    }}
                    onChange={(item: ?{ name: string }) => {
                      logger.warn('SearchSelectInput onChange', item);
                      if (!item) {
                        inputHandlers.onChange({
                          target: {
                            value: '',
                          },
                        });
                      } else {
                        inputHandlers.onChange({
                          target: {
                            value: item && item.name,
                          },
                        });
                      }
                    }}
                    onSearch={newQuery => {
                      logger.warn('onSearch', newQuery);
                      inputHandlers.onChange({
                        target: {
                          value: newQuery,
                        },
                      });
                    }}
                  />
                )}
              </StringValue>
            }
          />
        );
      }}
    </EnumProvider>
  );
}
