// @flow
import * as React from 'react';
import EnumProvider from 'providers/enum';
import {
  FieldItem,
  Label,
  Tooltip,
  SelectInput,
  DefaultSelect,
  DefaultOptions,
} from 'components/Form';

export default function selectEnumInputFactory({
  required = false,
  width = '200px',
  align = 'left',
  enumType,
  inputHandlers,
  name,
  isNew,
  label,
  initValue,
}: {
  enumType: string,
  required?: boolean,
  align?: string,
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
  initValue: any,
}) {
  const { isTouched, errorMessage, isFocused, ...inputHandler } = inputHandlers;
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
          errorMessage={isTouched && errorMessage}
          changedValues={{
            oldValue: initValue,
            newValue: inputHandlers.value,
          }}
        />
      }
      input={
        <EnumProvider enumType={enumType}>
          {({ loading, error, data }) => {
            if (loading) return null;
            if (error) return `Error!: ${error}`;
            return (
              <SelectInput
                {...inputHandler}
                onChange={newValue =>
                  inputHandlers.onChange({
                    target: {
                      value: newValue && newValue.name,
                    },
                  })
                }
                name={name}
                items={data}
                itemToString={item => (item ? item.description || item.name : '')}
                itemToValue={item => (item ? item.name : '')}
                renderSelect={({ ...rest }) => (
                  <DefaultSelect
                    {...rest}
                    align={align}
                    required
                    forceHoverStyle={isNew}
                    width="200px"
                    itemToString={item => (item ? item.description || item.name : '')}
                  />
                )}
                renderOptions={({ ...rest }) => (
                  <DefaultOptions
                    {...rest}
                    align={align}
                    items={data}
                    itemToString={item => (item ? item.description || item.name : '')}
                    itemToValue={item => (item ? item.name : '')}
                    width="200px"
                  />
                )}
              />
            );
          }}
        </EnumProvider>
      }
    />
  );
}
