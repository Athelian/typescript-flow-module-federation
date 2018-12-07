// @flow
import * as React from 'react';
import matchSorter from 'match-sorter';
import EnumProvider from 'providers/enum';
import { FieldItem, SearchSelectInput, DefaultSearchSelect, DefaultOptions } from 'components/Form';
import emitter from 'utils/emitter';
import { useTextInput } from 'modules/relationMap/common/TableInlineEdit/hooks';
import logger from 'utils/logger';

const filterItems = (query: string, items: Array<any>) => {
  if (!query) return items;
  return matchSorter(items, query, {
    keys: ['name', 'description'],
  });
};

type OptionalProps = {
  isRequired: boolean,
  disabled: boolean,
};

type Props = OptionalProps & {
  name: string,
  value: string,
  enumType: string,
};

const defaultProps = {
  isRequired: false,
  disabled: false,
};

export default function InlineSearchEnumInput({ name, value, enumType, isRequired }: Props) {
  const { hasError, isFocused, ...inputHandlers } = useTextInput(value, { isRequired });
  return (
    <EnumProvider enumType={enumType}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return `Error!: ${error}`;

        return (
          <FieldItem
            input={
              <SearchSelectInput
                {...inputHandlers}
                name={name}
                items={filterItems(inputHandlers.value, data)}
                itemToString={item => (item ? item.description || item.name : '')}
                itemToValue={item => (item ? item.name : '')}
                inputValue={inputHandlers.value}
                renderSelect={({ ...selectProps }) => (
                  <DefaultSearchSelect
                    {...selectProps}
                    hasError={hasError}
                    isOpen={isFocused}
                    itemToString={item => (item ? item.description || item.name : '')}
                    width="200px"
                    align="left"
                  />
                )}
                renderOptions={({ ...optionProps }) => (
                  <DefaultOptions
                    {...optionProps}
                    items={filterItems(inputHandlers.value, data)}
                    itemToString={item => (item ? item.description || item.name : '')}
                    itemToValue={item => (item ? item.name : '')}
                    width="200px"
                    align="left"
                  />
                )}
                afterClearSelection={() => {
                  logger.warn('afterClearSelection');
                  inputHandlers.onChange({
                    currentTarget: {
                      value: '',
                    },
                  });
                  setTimeout(() => {
                    inputHandlers.onBlur();
                    emitter.emit('INLINE_CHANGE', {
                      name,
                      hasError: !!isRequired,
                      value: '',
                    });
                    inputHandlers.onFocus();
                  }, 0);
                }}
                onBlur={() => {
                  logger.warn('SearchSelectInput onBlur', inputHandlers.value);
                  if (data.find(item => item.name === inputHandlers.value)) {
                    inputHandlers.onBlur();
                    emitter.emit('INLINE_CHANGE', {
                      name,
                      hasError: false,
                      value: inputHandlers.value,
                    });
                  } else {
                    inputHandlers.onChange({
                      currentTarget: {
                        value: '',
                      },
                    });
                    setTimeout(() => {
                      inputHandlers.onBlur();
                      emitter.emit('INLINE_CHANGE', {
                        name,
                        hasError: !!isRequired,
                        value: '',
                      });
                    }, 0);
                  }
                }}
                onChange={(item: ?{ name: string }) => {
                  logger.warn('SearchSelectInput onChange', item);
                  if (!item) {
                    inputHandlers.onChange({
                      currentTarget: {
                        value: '',
                      },
                    });
                  } else {
                    inputHandlers.onChange({
                      currentTarget: {
                        value: item && item.name,
                      },
                    });
                  }
                }}
                onSearch={newQuery => {
                  logger.warn('onSearch', newQuery);
                  inputHandlers.onChange({
                    currentTarget: {
                      value: newQuery,
                    },
                  });
                }}
              />
            }
          />
        );
      }}
    </EnumProvider>
  );
}

InlineSearchEnumInput.defaultProps = defaultProps;
