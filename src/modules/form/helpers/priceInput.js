// @flow
import * as React from 'react';
import { FieldItem, Label, Tooltip, NumberInput, DefaultPriceStyle } from 'components/Form';

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
  initValue,
}: {
  required?: boolean,
  align?: string,
  width?: string,
  height?: string,
  currency: string,
  isNew: boolean,
  label?: React.Node,
  name: string,
  inputHandlers: Object,
  initValue: any,
}) {
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
          errorMessage={inputHandlers.isTouched && inputHandlers.errorMessage}
          changedValues={{
            oldValue: initValue,
            newValue: inputHandlers.value,
          }}
        />
      }
      input={
        <DefaultPriceStyle
          currency={currency}
          isFocused={inputHandlers.isFocused}
          hasError={inputHandlers.isTouched && inputHandlers.errorMessage}
          forceHoverStyle={isNew}
          width={width}
          height={height}
        >
          <NumberInput align={align} name={name} {...inputHandlers} />
        </DefaultPriceStyle>
      }
    />
  );
}
