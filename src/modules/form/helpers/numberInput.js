// @flow
import * as React from 'react';
import { FieldItem, Label, Tooltip, DefaultStyle, NumberInput } from 'components/Form';

const numberInputFactory = ({
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
  WrapperComponent?: () => React.Node,
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
  initValue: number,
}) => {
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
};

export default numberInputFactory;
