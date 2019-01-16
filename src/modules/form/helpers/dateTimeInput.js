// @flow
import * as React from 'react';
import FormattedDate from 'components/FormattedDate';
import { FieldItem, Label, FormTooltip, DefaultStyle, DateTimeInput } from 'components/Form';

export default function dateTimeInputFactory({
  required = false,
  align = 'right',
  width = '200px',
  height = '30px',
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
            oldValue: originalValue ? (
              <FormattedDate value={originalValue} mode="time" />
            ) : (
              originalValue
            ),
            newValue: inputHandlers.value ? (
              <FormattedDate value={inputHandlers.value} mode="time" />
            ) : (
              inputHandlers.value
            ),
          }}
        />
      }
      input={
        <DefaultStyle
          type="date"
          isFocused={isFocused}
          hasError={isTouched && errorMessage}
          forceHoverStyle={isNew}
          width={width}
          height={height}
        >
          <DateTimeInput align={align} name={name} {...rest} />
        </DefaultStyle>
      }
    />
  );
}
