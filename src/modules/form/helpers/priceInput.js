// @flow
import * as React from 'react';
import { FieldItem, Label, FormTooltip, NumberInput, DefaultPriceStyle } from 'components/Form';

export default function priceInputFactory({
  required = false,
  width = '200px',
  height = '30px',
  align = 'right',
  currency,
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
  currency: string,
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
        <DefaultPriceStyle
          currency={currency}
          isFocused={isFocused}
          hasError={isTouched && errorMessage}
          forceHoverStyle={isNew}
          width={width}
          height={height}
        >
          <NumberInput align={align} name={name} {...rest} />
        </DefaultPriceStyle>
      }
    />
  );
}
