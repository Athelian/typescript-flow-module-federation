// @flow
import * as React from 'react';
import { FieldItem, Label, Tooltip, DefaultStyle, TextAreaInput } from 'components/Form';

export default function textAreaFactory({
  required = false,
  width = '200px',
  height = '300px',
  align = 'left',
  isNew,
  label,
  name,
  inputHandlers,
  originalValue,
}: {
  required?: boolean,
  width?: string,
  height?: string,
  align?: string,
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
        <DefaultStyle
          type="textarea"
          isFocused={isFocused}
          hasError={isTouched && errorMessage}
          forceHoverStyle={isNew}
          width={width}
          height={height}
        >
          <TextAreaInput align={align} name={name} {...rest} />
        </DefaultStyle>
      }
    />
  );
}
