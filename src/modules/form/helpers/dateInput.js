// @flow
import * as React from 'react';
import FormattedDate from 'components/FormattedDate';
import { FieldItem, Label, Tooltip, DefaultStyle, DateInput } from 'components/Form';

export default function dateInputFactory({
  required = false,
  align = 'right',
  width = '200px',
  height = '30px',
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
            oldValue: initValue ? <FormattedDate value={initValue} /> : initValue,
            newValue: inputHandlers.value ? (
              <FormattedDate value={inputHandlers.value} />
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
          <DateInput align={align} name={name} {...rest} />
        </DefaultStyle>
      }
    />
  );
}
