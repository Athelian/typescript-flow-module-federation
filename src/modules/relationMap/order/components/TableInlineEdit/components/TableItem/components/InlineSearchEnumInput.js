// @flow
import * as React from 'react';
import matchSorter from 'match-sorter';
import EnumProvider from 'providers/enum';
import { FieldItem, SearchSelectInput, DefaultSearchSelect, DefaultOptions } from 'components/Form';
import emitter from 'utils/emitter';
import { useTextInput } from 'modules/form/hooks';
import { parseEnumValue, parseEnumDescriptionOrValue } from 'components/Form/Factories/helpers';
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
  enumType: 'Currency' | 'Incoterm' | 'LoadType' | 'TransportType',
  id: string,
};

const defaultProps = {
  isRequired: false,
  disabled: false,
};

export default function InlineSearchEnumInput({ name, value, enumType, isRequired, id }: Props) {
  const { hasError, isFocused, ...inputHandlers } = useTextInput(value, { isRequired });

  return (
    <EnumProvider enumType={enumType}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return `Error!: ${error}`;
        const selectedItem = data.find(item => item.name === inputHandlers.value);
        return (
          <FieldItem
            input={
              <SearchSelectInput
                {...inputHandlers}
                name={name}
                items={filterItems(inputHandlers.value, data)}
                itemToString={parseEnumDescriptionOrValue}
                itemToValue={parseEnumValue}
                inputValue={parseEnumDescriptionOrValue(selectedItem)}
                renderSelect={({ ...selectProps }) => (
                  <DefaultSearchSelect
                    {...selectProps}
                    id={`input-${id}`}
                    hasError={hasError}
                    isOpen={isFocused}
                    width="200px"
                    align="left"
                  />
                )}
                renderOptions={({ ...optionProps }) => (
                  <DefaultOptions {...optionProps} width="200px" align="left" />
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
                    emitter.emit('INLINE_CHANGE', {
                      name,
                      hasError: !!isRequired,
                      value: '',
                    });
                  } else {
                    inputHandlers.onChange({
                      currentTarget: {
                        value: item && item.name,
                      },
                    });
                    emitter.emit('INLINE_CHANGE', {
                      name,
                      hasError: false,
                      value: item && item.name,
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
