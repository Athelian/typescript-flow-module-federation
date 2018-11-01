// @flow
import * as React from 'react';
import { FieldItem, Label, Tooltip, DefaultStyle, NumberInput } from 'components/Form';
import Icon from 'components/Icon';
import { CalculatorButtonStyle } from './style';

const numberInputFactory = ({
  WrapperComponent = DefaultStyle,
  required = false,
  hasTooltip = true,
  width = '200px',
  height = '30px',
  align = 'right',
  calculate,
  isNew,
  label,
  name,
  inputHandlers,
  originalValue,
}: {
  WrapperComponent?: () => React.Node,
  required?: boolean,
  hasTooltip?: boolean,
  align?: string,
  width?: string,
  height?: string,
  label?: React.Node,
  calculate?: Function,
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
  originalValue: number,
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
        hasTooltip ? (
          <Tooltip
            isNew={isNew}
            errorMessage={isTouched && errorMessage}
            changedValues={{
              oldValue: originalValue,
              newValue: inputHandlers.value,
            }}
          />
        ) : null
      }
      input={
        <>
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
          {calculate &&
            !isFocused && (
              <button className={CalculatorButtonStyle} type="button" onClick={calculate}>
                <Icon icon="CALCULATOR" />
              </button>
            )}
        </>
      }
    />
  );
};

export default numberInputFactory;
