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
  const [isValidEnum, setInValidEnum] = React.useState(false);

  React.useEffect(() => {
    if (!isValidEnum && !isFocused) {
      logger.warn('reset enum data');
      // clear data when the enum is not valid
      if (isRequired || inputHandlers.value) {
        // for require field, restore original value
        emitter.emit('INLINE_CHANGE', {
          name,
          hasError: false,
          value,
        });
      } else {
        emitter.emit('INLINE_CHANGE', {
          name,
          hasError: !!isRequired,
          value: '',
        });
      }
      setTimeout(() => {
        inputHandlers.onChange({
          currentTarget: {
            value,
          },
        });
      }, 0);
    }
  }, [inputHandlers, isFocused, isRequired, isValidEnum, name, value]);

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
                inputValue={parseEnumDescriptionOrValue(selectedItem) || inputHandlers.value}
                renderSelect={({ ...selectProps }) => (
                  <DefaultSearchSelect
                    {...selectProps}
                    id={`input-${id}`}
                    hideClearButton={isRequired}
                    hasError={hasError}
                    isOpen={isFocused}
                    width="200px"
                    align="left"
                  />
                )}
                renderOptions={({ ...optionProps }) => (
                  <DefaultOptions {...optionProps} width="200px" align="left" />
                )}
                onChange={(item: ?{ name: string }) => {
                  logger.warn('SearchSelectInput onChange', item);
                  if (!item) {
                    setInValidEnum(false);
                    inputHandlers.onChange({
                      currentTarget: {
                        value: '',
                      },
                    });
                  } else {
                    setInValidEnum(true);
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
                  logger.warn('onSearch', isValidEnum, newQuery);
                  inputHandlers.onChange({
                    currentTarget: {
                      value: newQuery,
                    },
                  });
                  setInValidEnum(false);
                }}
                afterClearSelection={() => {
                  logger.warn('afterClearSelection');
                  setInValidEnum(true);
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
