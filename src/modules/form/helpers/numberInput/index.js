// @flow
import * as React from 'react';
import { FieldItem, Label, FormTooltip, DefaultStyle, NumberInput } from 'components/Form';
import Icon from 'components/Icon';
import { CalculatorButtonStyle } from './style';

const renderDefaultCalculateComponent = ({
  calculate,
  isFocused,
}: {
  calculate: Function,
  isFocused: boolean,
}) => {
  if (calculate && !isFocused) {
    return (
      <button
        data-testid="calculatorButton"
        className={CalculatorButtonStyle}
        type="button"
        onClick={calculate}
      >
        <Icon icon="CALCULATOR" />
      </button>
    );
  }
  return null;
};

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
  renderCalculate = renderDefaultCalculateComponent,
}: {
  WrapperComponent?: ({
    transparent?: boolean,
    tabIndex?: string,
    id?: string,
    children: React.Node,
  }) => React.Node,
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
  renderCalculate?: Function,
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
          <FormTooltip
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
          {renderCalculate({ calculate, isFocused })}
        </>
      }
    />
  );
};

export default numberInputFactory;
