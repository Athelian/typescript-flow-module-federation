// @flow
import * as React from 'react';
import { FieldItem, Label, Tooltip, DefaultStyle, TextInput } from 'components/Form';

const textInputFactory = ({
  type = 'standard',
  required = false,
  WrapperComponent = DefaultStyle,
  align = 'right',
  InputComponent = TextInput,
  width = '200px',
  height = '30px',
  isNew,
  label,
  name,
  inputHandlers,
  originalValue,
}: {
  type?: 'standard' | 'label',
  WrapperComponent?: () => React.Node,
  InputComponent?: TextInput,
  required?: boolean,
  align?: string,
  width?: string,
  height?: string,
  label?: React.Node,
  isNew: boolean,
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
  originalValue: string,
}): React.Node => {
  const { isTouched, errorMessage, isFocused, ...rest } = inputHandlers;
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
            oldValue: originalValue,
            newValue: inputHandlers.value,
          }}
        />
      }
      input={
        <WrapperComponent
          type={type}
          isFocused={isFocused}
          hasError={isTouched && errorMessage}
          forceHoverStyle={isNew}
          width={width}
          height={height}
        >
          <InputComponent align={align} name={name} {...rest} />
        </WrapperComponent>
      }
    />
  );
};

export default textInputFactory;
