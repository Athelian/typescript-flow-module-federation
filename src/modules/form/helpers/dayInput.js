// @flow
import * as React from 'react';
import { FieldItem, Label, FormTooltip, NumberInput, DefaultDayStyle } from 'components/Form';

export default function dayInputFactory({
  required = false,
  width = '200px',
  height = '30px',
  align = 'right',
  isNew,
  label,
  name,
  inputHandlers,
  originalValue,
}: {
  required?: boolean,
  align?: string,
  width?: string,
  height?: string,
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
        <FormTooltip
          isNew={isNew}
          errorMessage={isTouched && errorMessage}
          changedValues={{
            oldValue: originalValue,
            newValue: inputHandlers.value,
          }}
        />
      }
      input={
        <DefaultDayStyle
          isFocused={isFocused}
          hasError={isTouched && errorMessage}
          forceHoverStyle={isNew}
          width={width}
          height={height}
        >
          <NumberInput align={align} name={name} {...rest} />
        </DefaultDayStyle>
      }
    />
  );
}
