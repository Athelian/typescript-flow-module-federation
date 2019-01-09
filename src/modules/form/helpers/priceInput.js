// @flow
import * as React from 'react';
import { toFloat } from 'utils/number';
import { FieldItem, Label, FormTooltip, NumberInput, DefaultPriceStyle } from 'components/Form';

export default function priceInputFactory({
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
    value: { amount: string, currency: string },
    isTouched: boolean,
    errorMessage: string,
    isFocused: boolean,
    onChange: Function,
    onFocus: Function,
    onBlur: Function,
  },
  originalValue: { amount: string, currency: string },
}) {
  const { isTouched, errorMessage, isFocused, value, onChange, ...rest } = inputHandlers;
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
            oldValue: `${originalValue.amount} ${originalValue.currency}`,
            newValue: `${value.amount} ${value.currency}`,
          }}
        />
      }
      input={
        <DefaultPriceStyle
          currency={value.currency}
          isFocused={isFocused}
          hasError={isTouched && errorMessage}
          forceHoverStyle={isNew}
          width={width}
          height={height}
        >
          <NumberInput
            align={align}
            name={name}
            value={value.amount}
            onChange={evt =>
              onChange({
                ...evt,
                target: {
                  value: {
                    amount: toFloat(evt.target.value),
                    currency: value.currency,
                  },
                },
              })
            }
            {...rest}
          />
        </DefaultPriceStyle>
      }
    />
  );
}
