// @flow
import * as React from 'react';
import { FieldItem, Label, Tooltip, DefaultStyle, TextAreaInput } from 'components/Form';

export default function textAreaFactory({
  required = false,
  width = '200px',
  height = '30px',
  align = 'left',
  isNew,
  label,
  name,
  inputHandlers,
  initValue,
}: {
  required?: boolean,
  width?: string,
  height?: string,
  align?: string,
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
        <DefaultStyle
          isFocused={inputHandlers.isFocused}
          hasError={inputHandlers.isTouched && inputHandlers.errorMessage}
          forceHoverStyle={isNew}
          width={width}
          height={height}
        >
          <TextAreaInput align={align} name={name} {...inputHandlers} />
        </DefaultStyle>
      }
    />
  );
}
