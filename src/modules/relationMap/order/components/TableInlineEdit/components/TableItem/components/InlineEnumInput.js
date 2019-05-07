// @flow
import * as React from 'react';
import EnumProvider from 'providers/enum';
import { FieldItem, SelectInput, DefaultSelect, DefaultOptions } from 'components/Form';
import emitter from 'utils/emitter';
import { useTextInput } from 'modules/form/hooks';
import { parseEnumValue, parseEnumDescriptionOrValue } from 'components/Form/Factories/helpers';
import logger from 'utils/logger';

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

export default function InlineEnumInput({ name, value, enumType, isRequired, id }: Props) {
  const { hasError, isFocused, ...inputHandlers } = useTextInput(value, { isRequired });

  return (
    <EnumProvider enumType={enumType}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return `Error!: ${error}`;
        return (
          <FieldItem
            input={
              <SelectInput
                {...inputHandlers}
                name={name}
                items={data}
                itemToString={parseEnumDescriptionOrValue}
                itemToValue={parseEnumValue}
                inputValue={inputHandlers.value}
                renderSelect={({ ...selectProps }) => (
                  <DefaultSelect
                    {...selectProps}
                    id={`input-${id}`}
                    hasError={hasError}
                    isOpen={isFocused}
                    width="200px"
                    align="left"
                  />
                )}
                renderOptions={({ ...optionProps }) => (
                  <DefaultOptions {...optionProps} items={data} width="200px" align="left" />
                )}
                afterClearSelection={() => {
                  logger.warn('afterClearSelection');
                  inputHandlers.onChange({
                    currentTarget: {
                      value: null,
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
                  logger.warn('SelectInput onBlur', inputHandlers.value);
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
                  logger.warn('SelectInput onChange', item);
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
              />
            }
          />
        );
      }}
    </EnumProvider>
  );
}

InlineEnumInput.defaultProps = defaultProps;
