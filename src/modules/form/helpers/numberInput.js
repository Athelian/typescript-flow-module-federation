// @flow
import * as React from 'react';
import { FieldItem, Label, Tooltip, DefaultStyle, NumberInput } from 'components/Form';

export default function numberInputFactory({
  WrapperComponent = DefaultStyle,
  required = false,
  width = '200px',
  height = '30px',
  align = 'right',
  isNew,
  label,
  name,
  inputHandlers,
  initValue,
}: {
  WrapperComponent?: React.Node,
  required?: boolean,
  align?: string,
  width?: string,
  height?: string,
  isNew: boolean,
  label?: React.Node,
  name: string,
  inputHandlers: Object,
  initValue: any,
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
        <WrapperComponent
          type="number"
          isFocused={isFocused}
          hasError={isTouched && errorMessage}
          forceHoverStyle={isNew}
          width={width}
          height={height}
        >
          <NumberInput align={align} name={name} {...rest} />
        </WrapperComponent>
      }
    />
  );
}
