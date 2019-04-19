// @flow
import * as React from 'react';
import { FieldItem, SelectInput, DefaultSelect, DefaultOptions } from 'components/Form';
import emitter from 'utils/emitter';
import { useTextInput } from 'modules/form/hooks';
import logger from 'utils/logger';

type OptionalProps = {
  isRequired: boolean,
  disabled: boolean,
};

type Props = OptionalProps & {
  name: string,
  value: string,
  items: Array<Object>,
  id: string,
};

const defaultProps = {
  isRequired: false,
  disabled: false,
};

export default function InlineSelectInput({ value, name, items, isRequired, id }: Props) {
  const { hasError, isFocused, ...inputHandlers } = useTextInput(value, { isRequired });

  return (
    <FieldItem
      input={
        <SelectInput
          {...inputHandlers}
          name={name}
          items={items}
          itemToString={item => (item ? item.label || item.value : '')}
          itemToValue={item => (item ? item.value : '')}
          inputValue={inputHandlers.value}
          renderSelect={({ ...selectProps }) => (
            <DefaultSelect
              {...selectProps}
              id={`input-${id}`}
              hasError={hasError}
              isOpen={isFocused}
              itemToString={item => (item ? item.label || item.value : '')}
              width="200px"
              align="left"
            />
          )}
          renderOptions={({ ...optionProps }) => (
            <DefaultOptions
              {...optionProps}
              items={items}
              itemToString={item => (item ? item.label || item.value : '')}
              itemToValue={item => (item ? item.value : '')}
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
            logger.warn('SelectInput onBlur', inputHandlers.value);
            if (items.find(item => item.value === inputHandlers.value)) {
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
          onChange={(item: ?{ value: string }) => {
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
                  value: item && item.value,
                },
              });
              emitter.emit('INLINE_CHANGE', {
                name,
                hasError: false,
                value: item && item.value,
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
}

InlineSelectInput.defaultProps = defaultProps;
