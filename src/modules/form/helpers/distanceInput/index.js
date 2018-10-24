// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { FieldItem, Label, Tooltip } from 'components/Form';
import DefaultMetricStyle from 'components/Form/Inputs/MetricInput/DefaultMetricStyle';
import MetricInput from 'components/Form/Inputs/MetricInput';
import { type MetricValue } from 'components/Form/Inputs/MetricInput/type';

import { CalculatorButtonStyle } from '../numberInput/style';

const metrics = ['cm', 'm'];

const calculateValue = (value: number, metric: string, newMetric: string) => {
  if (metric === 'm' && newMetric === 'cm') return value * 100;
  if (metric === 'cm' && newMetric === 'm') return value / 100;
  return value;
};

const distanceInputFactory = ({
  required = false,
  width = '200px',
  height = '30px',
  calculate,
  isNew,
  label,
  inputHandlers,
  originalValue,
}: {
  required?: boolean,
  align?: string,
  width?: string,
  height?: string,
  label?: React.Node,
  calculate?: Function,
  isNew: boolean,
  inputHandlers: {
    name: string,
    value: MetricValue,
    isTouched: boolean,
    errorMessage: string,
    isFocused: boolean,
    onChange: Function,
    onFocus: Function,
    onBlur: Function,
  },
  originalValue: MetricValue,
}) => {
  const { isTouched, errorMessage, isFocused, ...inputHandler } = inputHandlers;
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
            oldValue: `${originalValue.value} ${originalValue.metric}`,
            newValue: `${inputHandlers.value.value} ${inputHandlers.value.metric}`,
          }}
        />
      }
      input={
        <>
          <DefaultMetricStyle
            isFocused={isFocused}
            hasError={isTouched && !!errorMessage}
            forceHoverStyle={isNew}
            width={width}
            height={height}
          >
            <MetricInput {...inputHandler} metrics={metrics} calculateValue={calculateValue} />
          </DefaultMetricStyle>
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

export default distanceInputFactory;
